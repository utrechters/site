# utrechters

Volunteer-run website for a Utrecht meetup community for expats and locals. Keep it small and simple.

## Stack

SvelteKit 3, Svelte 5 (runes), Vite 8, Tailwind CSS 4 via `@tailwindcss/vite`, TypeScript 6 strict, `@sveltejs/adapter-netlify`, ESLint 9, Prettier 3.

## Commands

```bash
npm start          # mock event API on :3001 + dev server
npm run dev        # dev server only
npm run build
npm run check      # svelte-check
npm run lint       # Prettier check + ESLint
npm run format
npm run smoke      # after build: serves the build with the mock API and checks key pages
```

Run `npm run lint && npm run check` before calling a change done.

## Structure

```
src/
  app.css                    # Tailwind import + theme CSS variables
  env.ts                     # env vars: WHATSAPP_LINK, TURNSTILE_SECRET, PUBLIC_TURNSTILE_SITE_KEY
  components/                # atoms/, molecules/, organisms/
  lib/
    inView.ts                # IntersectionObserver helper
    seo.ts                   # site constants, JSON-LD
    server/events.ts         # event API fetch, icon cache
    server/private.ts        # private links (WhatsApp)
  routes/
    +page.server.ts          # loads events
    +page.svelte             # home: hero, about, rules, faq, contact
    privacy/                 # privacy policy
    icons/[id]/+server.ts    # proxies and caches event icons
    p/[key]/                 # Turnstile page for a private link
    api/private/+server.ts   # verifies the Turnstile token, returns private links
mock/server.ts               # mock event API
scripts/                     # smoke test (smoke.sh, serve.ts)
```

- Import lib code as `#lib/...` (`imports` in `package.json`).
- Load data in `+page.server.ts`, never `+page.ts`.
- In-page navigation uses hash anchors (`#about`, `#rules`, `#faq`, `#contact`).

## Svelte

Runes only: `$props`, `$state`, `$derived`, `$effect`, `onclick={...}`, snippets with `{@render}`. No `export let`, `$:`, `on:event`, `createEventDispatcher`, stores or `<slot>`.

## Styling

- Tailwind v4: `@import "tailwindcss"` in `app.css`. Add colors as CSS variables there. `tailwind.config.ts` only loads the typography plugin.
- Use the semantic colors, not raw ones like `text-green-700`: `cream` (page background), `warm` (borders, subtle backgrounds), `surface` (dark sections), `accent` (teal, interactive), `accent-light`, `highlight` (beige), `text`, `text-muted`.
- Mobile-first, then `sm:` / `md:`. Grid for multi-column layouts.
- Wrap animations in `motion-safe:`. No inline styles.
- Semantic HTML, correct heading order, ARIA labels where needed.
- External links get `target="_blank" rel="noreferrer"`.

## Code style

Prettier enforces tabs, no semicolons, double quotes, no trailing commas, 100-character lines. Component files are camelCase.

## Dependencies

Keep them minimal. If it fits in about 10 lines of code, write it. Dev-only tools are fine. Ask before adding a runtime UI library or state manager.

## Events API

- `VITE_EVENT_API` (default `http://localhost:3001`) returns the next 0 to 3 events, sorted by date, one per title.
- Shape: `{ title, link, date, icon }[]`, all strings. `date` is ISO 8601, never null. `[]` renders an empty state.
- The load runs on every request (SSR). Don't add cache logic.

## Deployment

Netlify with Node functions, not Edge Functions. `netlify.toml` builds with `npm run build` and publishes `build/`. Deploy previews only build for PRs with the `preview` label.

## CI and Dependabot

- `ci.yml` runs lint, check, build and smoke on PRs and on pushes to `main`. Its `check` job is required to merge.
- Dependabot opens npm PRs daily, with minor and patch updates grouped, and GitHub Actions PRs monthly. Cooldown is 7 days for majors and 2 days otherwise. `@types/node` majors are ignored.
- `dependabot-automerge.yml` enables squash auto-merge on every Dependabot PR, majors included. GitHub merges it once `check` passes.
- Control a PR with comments: `@dependabot rebase`, `@dependabot recreate`, `@dependabot ignore this major version`, `@dependabot unignore <dependency>`.
- TypeScript 7 is ignored until `svelte-check` supports it. See the TODO in `README.md`.
