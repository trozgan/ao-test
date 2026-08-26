# Stack

Northwind marketing site — a small Next.js App Router demo used as an Overdeck
pipeline test bed.

## Runtime and framework

- **Next.js 16.3.3** with the **App Router** and **Turbopack** (`next build`
  prints `▲ Next.js 16.3.3 (Turbopack)`). Every route is statically prerendered.
- **React 19.2.8** / `react-dom` 19.2.8.
- **TypeScript 5**, strict via `tsconfig.json`. Path alias `@/*` → repo root.
- `typedRoutes` is **not** enabled in `next.config.ts`, so a plain `string`
  `href` is accepted by `next/link` (see `app/components/ButtonLink.tsx:6`).

Read `node_modules/next/dist/docs/` before writing Next-specific code. This
Next major has breaking changes relative to most training data — `AGENTS.md`
carries that warning and `next dev` re-writes it.

## Styling

- **Tailwind CSS v4** through `@tailwindcss/postcss` (`postcss.config.mjs`).
  There is no `tailwind.config.*`; configuration lives in `app/globals.css`.
- Theme tokens `--background` / `--foreground` are declared in
  `app/globals.css` and exposed as the `background` / `foreground` Tailwind
  colors. Dark mode is handled by `prefers-color-scheme`, not a class toggle.
- Font: `next/font/google` Geist, wired in `app/layout.tsx:6-9` as
  `--font-geist-sans`. Geist Mono is not loaded.

## Testing

- **Vitest 4** + **@testing-library/react** in a **jsdom** environment.
- `vitest.config.mts` uses `@vitejs/plugin-react`; `vitest.setup.ts` pulls in
  `@testing-library/jest-dom` and registers an `afterEach(cleanup)`.
- `test.include` is `["__tests__/**/*.test.tsx"]` — **`.test.ts` files are not
  collected.** A non-JSX test must either use the `.tsx` extension or the glob
  must be widened.
- `@testing-library/user-event` is **not** a dependency. Interaction tests use
  `fireEvent` from `@testing-library/react` or a direct DOM `.click()`.
- Web fetch primitives (`Request`, `Response`, `Response.json`, `fetch`) are
  available under this jsdom environment — verified 2026-08-26 with a throwaway
  probe. Route-handler tests need no `@vitest-environment node` pragma.

## Linting

- **ESLint 9** flat config in `eslint.config.mjs`, composed from
  `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- The config calls `globalIgnores([...])`, which **replaces** the defaults that
  `eslint-config-next` would otherwise apply, so anything not listed there is
  linted — including agent tooling directories that are not project source.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Next dev server on port 3000 |
| `npm run build` | Production build; also runs the TypeScript check |
| `npm run lint` | ESLint over the repo |
| `npm test` | `vitest run` — the whole suite, once |

There is no CI workflow; `.github/` does not exist. The gates above are run by
hand or by a pipeline agent.

<!-- last-verified: 2026-08-26 -->
