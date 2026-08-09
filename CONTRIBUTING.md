# Contributing

First of all: thank you for considering contributing ❤️  
This website exists because people care. Contributions are welcome.

## What You Can Contribute

- Fix typos or unclear wording
- Improve accessibility
- Improve structure or clarity
- Suggest better copy
- Improve performance
- Propose UI improvements
- Add helpful features

Small improvements are just as valuable as big ones.

## How to Contribute

1. Open an issue to discuss your idea (especially for larger changes).
2. Fork the repository.
3. Create a feature branch.
4. Open a pull request with a clear explanation of what and why.

If you’re unsure — just ask. We’re happy to talk things through.

## About Design & UI Decisions

Some changes (especially UI/UX and visual design) involve subjective judgment.

We try to stay as objective as possible and evaluate proposals based on:

- Clarity
- Accessibility
- Simplicity
- Maintainability
- Alignment with the community’s tone

If a decision isn’t obvious, it may be discussed internally with the “internal council” — a small group that helps maintain consistency and direction.

Not every proposal will be accepted, but every contribution will be treated respectfully.

## How to Add an Expat Bivalent Item

The game's content lives in flat JSON files — no code changes needed.

1. Open `src/lib/data/items/<code>.json` for your country (`ch`, `ro`, or `nl`).
2. Append one line:

   ```json
   { "id": "nl-example", "category": "food", "intensity": 1 }
   ```

   - `id` must be prefixed with the country code (`nl-*` in `items/nl.json`).
   - `category`: one of `food` | `place` | `icon` | `transport` | `trait` | `economics` | `misc`.
   - `intensity`: `1` (light/fun) · `2` (notable) · `3` (identity-defining).

3. Add the English display string to `src/lib/data/i18n/en/<code>.json`:
   ```json
   { ..., "nl-example": "My item label" }
   ```
4. Optionally add translations in `src/lib/data/i18n/nl/<code>.json` and `hu/`.
5. Run `npm run validate:data` — all checks must pass.
6. Open a PR. No code review needed for content-only additions.

## Keep It Kind

This is a community project.  
Assume good intent. Be constructive. Be patient.

We're building something for people — not for metrics.

Thank you for being part of it.
