# CLAUDE.md — utrechters

Volunteer-run website for a Utrecht-based expat meetup community. Intentionally small and simple — keep it that way.

## Stack

| Tool | Version |
|---|---|
| SvelteKit | ^2.50 |
| Svelte | ^5.50 (runes mode) |
| Vite | ^6 |
| Tailwind CSS | v4 (via `@tailwindcss/vite`) |
| TypeScript | ^5, strict mode |
| Adapter | `@sveltejs/adapter-netlify` |
| Linting | ESLint 9 flat config + Prettier 3 |

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run preview    # preview production build
npm run check      # svelte-check (type checking)
npm run lint       # ESLint + Prettier check
npm run format     # auto-format all files
```

Always run `npm run lint && npm run check` before considering a change done.

## Architecture

```
src/
  app.css                  # Tailwind import + custom CSS variables (theme lives here)
  components/
    atoms/                 # Single-purpose: eventBox, link, svgIcon
    molecules/             # Composed: navigation, altNav
    organisms/             # Layout-level: header, footer
  lib/
    inView.ts              # Intersection Observer utility
  routes/
    +layout.svelte         # Root layout
    +page.server.ts        # Server-side event data fetch (NOT +page.ts)
    +page.svelte           # Home page (hero, about, guidelines, contact)
    privacy/
      +page.svelte         # Privacy policy
```

- Component filenames: camelCase (e.g. `eventBox.svelte`)
- Data loading: always server-side in `+page.server.ts`, never in `+page.ts`
- In-page navigation uses hash anchors (`#about`, `#rules`, `#contact`)

## Svelte 5 — Runes Only

Always use runes. Never use Svelte 4 legacy syntax.

```svelte
<!-- Props -->
let { title, count = 0 }: { title: string; count?: number } = $props()

<!-- State -->
let open = $state(false)

<!-- Derived -->
let doubled = $derived(count * 2)

<!-- Effects -->
$effect(() => { console.log(open) })

<!-- Events -->
<button onclick={() => (open = !open)}>toggle</button>

<!-- Children (not slots) -->
{@render children()}
```

- No `export let`, no `$:`, no `on:event`, no `createEventDispatcher`
- No Svelte stores — use `$state` / `$derived` instead
- No `<slot>` — use snippet syntax with `{@render}`

## Tailwind CSS v4

- Import: `@import "tailwindcss"` in `app.css` — no `@tailwind` directives
- Theme tokens are CSS variables in `app.css`, not in a config file
- No `tailwind.config.js` changes needed for new colors — add variables to `app.css`

### Custom color palette

| Variable | Usage |
|---|---|
| `--color-cream` (`#faf7f2`) | Page background |
| `--color-warm` (`#f0ebe4`) | Borders, subtle backgrounds |
| `--color-surface` (`#1e1c1a`) | Dark sections background |
| `--color-accent` (`#00816a`) | Primary interactive color (teal) |
| `--color-accent-light` (`#e6f4f0`) | Light accent backgrounds |
| `--color-highlight` (`#e8d5b7`) | Warm beige highlights |
| `--color-text` (`#2d2a26`) | Body text |
| `--color-text-muted` (`#6b6560`) | Secondary text |

Use these semantic names — avoid raw Tailwind color utilities like `text-green-700`.

## Design Guidelines

- **Mobile-first**: write base styles for mobile, layer `sm:` / `md:` on top
- **Animations**: always wrap with `motion-safe:` — respect user preferences
- **No inline styles** — Tailwind classes only
- **Layouts**: CSS Grid for multi-column (`grid sm:grid-cols-2`)
- **Accessibility**: semantic HTML, proper heading hierarchy (`h1` → `h2` → ...), ARIA labels where needed
- **External links**: always `target="_blank" rel="noreferrer"`
- `@tailwindcss/typography` is available for rich text sections

## Code Style

Enforced by Prettier — run `npm run format` to apply:

- Tabs (width 2), no semicolons, double quotes, no trailing commas
- Print width: 100 characters
- Plugins active: `prettier-plugin-svelte`, `prettier-plugin-tailwindcss`

## Dependencies Philosophy

This site has minimal dependencies by design. Before adding any package:

1. Can this be done in ~10 lines of Svelte or TypeScript? If yes, do that.
2. Is it a dev-only tool (linting, typing)? Fine to add.
3. Is it a runtime UI library or state manager? Probably not — ask first.

## Events API

Server-side only — see [src/routes/+page.server.ts](src/routes/+page.server.ts).

- Endpoint configured via `VITE_EVENT_API` env var (default: `http://localhost:3001`)
- Returns upcoming Tuesday and Friday meetup events
- Shape: `{ Tuesday: { link: string, date: Date | null }, Friday: { ... } }`
- Caching is handled by SvelteKit's server load lifecycle — no manual cache logic needed
- Changes weekly at most; the server load runs on each page request (SSR)

## Deployment

- Platform: Netlify
- Build: `npm run build` → publish dir `build/`
- Node-based Netlify functions (not Edge Functions)
- Config: [netlify.toml](netlify.toml)
