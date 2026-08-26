# Conventions

## Components

- Pages are Server Components by default. Reach for `"use client"` only when a
  hook demands it — `app/components/Nav.tsx` is the only one, and only because
  of `usePathname()`.
- Every page exports `metadata: Metadata` with a `title` and `description`.
- Page content is wrapped in `<Container className="py-16 sm:py-24">`. The
  page does **not** render its own nav or header.
- Sub-page `<h1>` is `text-3xl font-semibold tracking-tight ... sm:text-4xl`;
  the home hero is one step larger (`text-4xl ... sm:text-5xl`).
- Repeating content is a `const` array of plain objects above the component,
  mapped in the JSX — see `features` in `app/page.tsx` and `tiers` in
  `app/pricing/page.tsx`. Keys come from a stable field such as `name`.

## Styling

- Use the `foreground` / `background` theme tokens, never raw colors. Muted
  body text is `text-foreground/70`; borders are
  `border-black/[.08] dark:border-white/[.145]`.
- Responsive grids start at `grid-cols-1` and step up at `md:` —
  `md:grid-cols-3` is the established card-row breakpoint on both `/` and
  `/pricing`.
- Interactive targets carry `min-h-11` so touch targets stay large enough; see
  the nav links and `buttonStyles.ts`.
- Never hand-roll button styling. Import `ButtonLink` (or `Button`) and pass
  `variant="primary" | "secondary"`.

## Tests

- One file per component or page in `__tests__/`, named `<Thing>.test.tsx`.
- Import the subject through the `@/` alias: `import Pricing from
  "@/app/pricing/page"`.
- **Query by role and accessible name, not by CSS class or test id.** The whole
  suite is written this way — `getByRole("heading", { level: 2 })`,
  `getByRole("link", { name: "Pricing" })`. A test that asserts Tailwind class
  strings is off-convention.
- Mock `next/navigation` with `vi.mock` when the subject renders `Nav` or is
  `Nav`.
- Exact-count assertions are deliberate. `__tests__/Nav.test.tsx` asserts the
  full nav link list and a total link count so an accidental addition fails
  loudly rather than sliding through.

## Git

- Conventional commit subjects: `feat(pricing): ...`, `fix: ...`,
  `refactor: ...`, `style: ...`, `test: ...`, `chore(state): ...`.
- Scope is optional and used when the change sits in one area.

## Verification before handing work off

Run all three; they are fast (build ≈ 5s, suite ≈ 1.5s):

```bash
npm run lint
npm test
npm run build
```

<!-- last-verified: 2026-08-26 -->
