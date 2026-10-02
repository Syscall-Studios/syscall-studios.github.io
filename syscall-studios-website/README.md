# Syscall Studios Website

The public website for Syscall Studios. Built as a lightweight static
Astro site with plain CSS, Markdown content, and minimal client-side
JavaScript.

It's hosted on Cloudflare as a single Worker. The pages are served as
static files, and a small piece of code in `worker/` handles the
newsletter sign-up form at `/api/subscribe`. Page views never run that
code, so they don't count toward Cloudflare's free-tier limits.

## Development

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

The local development server runs at `http://localhost:4321`.

## Commands

- `npm run dev` starts the development server.
- `npm run build` creates the static production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm test` builds the site and runs a few smoke checks.
- `npm run dev:cloudflare` builds the site and runs it with the Worker, the
  way Cloudflare serves it, at `http://localhost:8787`.
- `npm run check:worker` type-checks the Worker.
- `npm run export:subscribers` downloads the newsletter list as a CSV.

## Content

- Studio details, emails, social links and newsletter settings: `src/data/site.json`
- Games and projects: `src/data/games.json`
- Dev Log posts: `src/data/devlog/`

Treat all content and assets in this repository as public information.
Do not add private details about unannounced projects.

## Deploying to Cloudflare

Cloudflare builds and deploys the site every time you push to `main`.
This is a one-time setup and needs a free Cloudflare account.

### 1. Create the database

From this folder:

```sh
npm install
npx wrangler login
npx wrangler d1 create syscall-newsletter
```

Copy the `database_id` it prints into `wrangler.jsonc`, replacing
`REPLACE_WITH_DATABASE_ID`, and commit that change. The ID isn't a secret.
Then create the table:

```sh
npm run db:init
```

### 2. Connect the repository

In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a
repository**, connect GitHub, and pick this repository. This works with
private repositories.

- Project name: `syscall-studios-github-io` (must match `name` in `wrangler.jsonc`)
- Production branch: `main`
- Root directory: `syscall-studios-website`
- Build command: `npm test`
- Deploy command: `npx wrangler deploy`

Using `npm test` as the build command means a failing test stops the deploy.

### 3. Set up bot protection

Go to **Turnstile → Add widget**.

- Hostnames: `syscallstudios.com`, `www.syscallstudios.com`, and the
  project's `workers.dev` address
- Widget mode: **Managed**

Add the **secret key** to the Worker under **Settings → Variables and
Secrets** as a secret named `TURNSTILE_SECRET`. Set the type to **Secret**,
not Text: plain-text variables are printed in build logs and removed by the
next deploy. Never commit it.

Put the **site key** in `src/data/site.json` under `newsletter.turnstileSiteKey`
and push. The site key is public by design. The sign-up form appears in the
footer once it's set.

### 4. Point the domain at it

`syscallstudios.com` has to use Cloudflare for DNS. If it doesn't yet, add
the domain to Cloudflare and switch the nameservers at your registrar.

**Before switching nameservers,** check that Cloudflare copied your email
DNS records (`MX`, plus the `TXT` records for SPF and DKIM). If they're
missing, email to `hello@`, `press@` and `support@` will stop arriving.

Then, on the Worker, go to **Settings → Domains & Routes → Add → Custom
domain** and add `syscallstudios.com` and `www.syscallstudios.com`.

### 5. Retire GitHub Pages

In the GitHub repository settings, turn off **Pages**. After that you can
make the repository private.

## Newsletter

Sign-ups are stored in a Cloudflare D1 database called `syscall-newsletter`.
To get the list as a spreadsheet:

```sh
npm run export:subscribers
```

This saves `subscribers-YYYY-MM-DD.csv`. CSV files are git-ignored because
they contain people's email addresses, so don't commit them.

Each visitor can submit the form 5 times a minute, which you can change in
`wrangler.jsonc`. On the free plan, the Worker allows around 100,000
sign-up requests a day. If the limit is ever reached, sign-ups pause until
it resets, and the rest of the site keeps working.

### Testing the form locally

```sh
cp .dev.vars.example .dev.vars
npm run db:init:local
```

Temporarily set `newsletter.turnstileSiteKey` in `src/data/site.json` to
Cloudflare's test key `1x00000000000000000000AA`, then run
`npm run dev:cloudflare` and open `http://localhost:8787`. Use
`npm run export:subscribers:local` to see what was saved. Set the key back
before committing.
