# Architecture

A four-page static marketing site. As of `fdf7000` there is no data layer, no
API route, no server action, and no client-side state beyond the nav's
active-link check.

## Route map

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero, three feature cards, closing CTA |
| `/about` | `app/about/page.tsx` | Company copy |
| `/pricing` | `app/pricing/page.tsx` | Three pricing tiers |
| `/contact` | `app/contact/page.tsx` | Contact copy and a `mailto:` link |

All four are Server Components and prerender to static HTML. `next build`
lists exactly these plus `/_not-found`.

## Layout shell

`app/layout.tsx` is the only place `Nav` is mounted. It sets the Geist font
variable on `<html>` and wraps `{children}` in a `<main>`. Pages therefore
render **page content only** — a page that mounts its own `Nav` would give the
site two `<header>`/`<nav>` landmarks, which
`__tests__/pageLandmarks.test.tsx` asserts against for every page.

## UI kit

Four shared components under `app/components/`, plus one style module:

- **`Container.tsx`** — the width constraint (`mx-auto w-full max-w-5xl px-6`).
  Every page and the nav wrap their content in it. Accepts `className` for
  vertical rhythm.
- **`Card.tsx`** — bordered, rounded surface. Accepts `className`, which is how
  `/pricing` adds `flex h-full flex-col` and the featured ring.
- **`Button.tsx`** / **`ButtonLink.tsx`** — a `<button>` and a `next/link`
  anchor sharing one appearance. `Button` spreads native
  `ButtonHTMLAttributes`, so `type="submit"`, `disabled`, and `onClick` all
  pass through (`app/components/Button.tsx:4-17`).
- **`buttonStyles.ts`** — the single source of the `primary` / `secondary`
  variant classes that both button components consume. Change appearance here,
  not in the components.

`Nav.tsx` is the only Client Component (`"use client"`), because it calls
`usePathname()` to set `aria-current="page"` on the active link. Its `links`
array at `app/components/Nav.tsx:7-12` is the site navigation — adding a route
means adding a row there.

## Where a new page goes

1. `app/<route>/page.tsx` — default-export a Server Component, export
   `metadata`, wrap in `Container`, reuse `Card` / `ButtonLink`.
2. Add `{ href, label }` to the `links` array in `app/components/Nav.tsx`.
3. Update the exact-count assertions in `__tests__/Nav.test.tsx` — the label
   list, the total link count, and the `test.each` active-link table.
4. Add the page to the `pages` tuple in `__tests__/pageLandmarks.test.tsx`.
5. Add a `__tests__/<Name>Page.test.tsx` covering the page's own behavior.

## Where a new API route goes

No route handler exists yet. Next 16 App Router convention (see
`node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`):
`app/api/<name>/route.ts` exporting named `GET` / `POST` / … functions that
take a Web `Request` and return a `Response`. A `route.ts` may not sit at the
same segment level as a `page.tsx`. Route handlers are not cached by default.

<!-- last-verified: 2026-08-26 -->
