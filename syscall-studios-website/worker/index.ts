interface Env {
    ASSETS: Fetcher;
    DB: D1Database;
    SIGNUP_LIMITER?: RateLimit;
    TURNSTILE_SECRET?: string;
    TURNSTILE_HOSTNAMES?: string;
    TURNSTILE_ALLOW_TEST_KEYS?: string;
}

interface SiteverifyResult {
    success: boolean;
    action?: string;
    hostname?: string;
    metadata?: { result_with_testing_key?: boolean };
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
const TURNSTILE_ACTION = "signup";
const MAX_TOKEN_LENGTH = 2048;

const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });

const expectedHostnames = (env: Env) =>
    new Set(
        (env.TURNSTILE_HOSTNAMES ?? "")
            .split(",")
            .map((hostname) => hostname.trim())
            .filter(Boolean)
    );

const verifyTurnstile = async (env: Env, secret: string, token: string, ip: string | null) => {
    const hostnames = expectedHostnames(env);

    if (token.length === 0 || token.length > MAX_TOKEN_LENGTH || hostnames.size === 0) {
        return false;
    }

    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);

    let result: SiteverifyResult;
    try {
        const response = await fetch(TURNSTILE_VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            signal: AbortSignal.timeout(10_000),
            body
        });
        if (!response.ok) throw new Error(`siteverify ${response.status}`);
        result = await response.json<SiteverifyResult>();
    } catch (error) {
        console.error("Turnstile siteverify failed", error);
        return false;
    }

    // Cloudflare's test keys never return an action, so local testing can opt out of that one check.
    const testKeyResult =
        env.TURNSTILE_ALLOW_TEST_KEYS === "true" && result.metadata?.result_with_testing_key === true;

    return (
        result.success === true &&
        (testKeyResult || result.action === TURNSTILE_ACTION) &&
        hostnames.has(result.hostname ?? "")
    );
};

const subscribe = async (request: Request, env: Env) => {
    if (request.method !== "POST") {
        return json({ error: "method_not_allowed" }, 405);
    }

    // The form posts from the same site, so any other origin is someone else's page.
    if (request.headers.get("Origin") !== new URL(request.url).origin) {
        return json({ error: "forbidden_origin" }, 403);
    }

    if (!env.TURNSTILE_SECRET || expectedHostnames(env).size === 0) {
        console.error("TURNSTILE_SECRET or TURNSTILE_HOSTNAMES is not set.");
        return json({ error: "not_configured" }, 500);
    }

    const ip = request.headers.get("CF-Connecting-IP");

    if (env.SIGNUP_LIMITER) {
        const { success } = await env.SIGNUP_LIMITER.limit({ key: ip ?? "unknown" });
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

    if (!(await verifyTurnstile(env, env.TURNSTILE_SECRET, token, ip))) {
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
