interface Env {
    ASSETS: Fetcher;
    DB: D1Database;
    SIGNUP_LIMITER?: RateLimit;
    TURNSTILE_SECRET?: string;
}

interface SignupBody {
    email?: unknown;
    token?: unknown;
    source?: unknown;
    website?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });

const verifyTurnstile = async (secret: string, token: string, ip: string) => {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    form.append("remoteip", ip);

    const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
    const outcome = await response.json<{ success: boolean }>();

    return outcome.success;
};

const subscribe = async (request: Request, env: Env) => {
    if (request.method !== "POST") {
        return json({ error: "method_not_allowed" }, 405);
    }

    // The form posts from the same site, so any other origin is someone else's page.
    if (request.headers.get("Origin") !== new URL(request.url).origin) {
        return json({ error: "forbidden_origin" }, 403);
    }

    if (!env.TURNSTILE_SECRET) {
        console.error("TURNSTILE_SECRET is not set.");
        return json({ error: "not_configured" }, 500);
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";

    if (env.SIGNUP_LIMITER) {
        const { success } = await env.SIGNUP_LIMITER.limit({ key: ip });
        if (!success) return json({ error: "rate_limited" }, 429);
    }

    let body: SignupBody;
    try {
        body = await request.json();
    } catch {
        return json({ error: "invalid_body" }, 400);
    }

    // Real people never see the honeypot field, so anything in it is a bot.
    // Report success so the bot has no reason to retry.
    if (typeof body.website === "string" && body.website !== "") {
        return json({ ok: true }, 200);
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
        return json({ error: "invalid_email" }, 400);
    }

    const token = typeof body.token === "string" ? body.token : "";

    if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET, token, ip))) {
        return json({ error: "verification_failed" }, 403);
    }

    const source = typeof body.source === "string" ? body.source.slice(0, 64) : null;

    try {
        await env.DB.prepare(
            "INSERT INTO subscribers (email, source, created_at) VALUES (?1, ?2, ?3) ON CONFLICT(email) DO NOTHING"
        )
            .bind(email, source, new Date().toISOString())
            .run();
    } catch (error) {
        console.error("Failed to save subscriber", error);
        return json({ error: "server_error" }, 500);
    }

    // Duplicates get the same response, so the form can't be used to check who's subscribed.
    return json({ ok: true }, 200);
};

export default {
    async fetch(request, env): Promise<Response> {
        const { pathname } = new URL(request.url);

        if (pathname === "/api/subscribe") {
            return subscribe(request, env);
        }

        if (pathname.startsWith("/api/")) {
            return json({ error: "not_found" }, 404);
        }

        return env.ASSETS.fetch(request);
    }
} satisfies ExportedHandler<Env>;
