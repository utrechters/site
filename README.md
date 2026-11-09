# Utrechters site

The is a basic site, patched together in a short time, if you have any suggestions or improvement ideas open an issue or if you are confident open a PR right away.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## TODO: unignore TypeScript 7

Dependabot ignores TypeScript 7 (`@dependabot ignore this major version` on PR #11). `svelte-check` only accepts TypeScript 5 or 6 as a peer, so `npm ci` fails on 7.

Once `npm view svelte-check peerDependencies` lists TypeScript 7, comment on any open Dependabot PR:

```
@dependabot unignore typescript
```

Dependabot then opens a TypeScript 7 PR, which auto-merges when the `check` CI job passes. To try it on a Netlify deploy preview first:

1. Turn off auto-merge: `gh pr merge --disable-auto <number>`
2. Add the `preview` label. Netlify only builds previews for PRs with that label (see `netlify.toml`).
3. Comment `@dependabot recreate` to start a new build. Netlify checks the label at build time, so adding the label alone does not start a build.
4. Check the preview link Netlify posts on the PR, then merge it.
