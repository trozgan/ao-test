# Architecture

A four-page static marketing site. There is no data layer, no API route, no
server action, and no client-side state beyond the nav's active-link check.

## Route map

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Hero, three feature cards, closing CTA |
| `/about` | `app/about/page.tsx` | Company copy |
| `/pricing` | `app/pricing/page.tsx` | Three pricing tiers |
| `/contact` | `app/contact/page.tsx` | Contact copy and a `mailto:` link |

All four are Server Components and prerender to static HTML.

## Layout shell

`app/layout.tsx` is the only place `Nav` is mounted. It sets the Geist font
variables on `<body>` and wraps `{children}` in a `<main>`. Pages therefore
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
  anchor sharing one appearance. `ButtonLink` is what pages use for CTAs.
- **`buttonStyles.ts`** — the single source of the `primary` / `secondary`
  variant classes that both button components consume. Change appearance here,
  not in the components.

`Nav.tsx` is the only Client Component (`"use client"`), because it calls
`usePathname()` to set `aria-current="page"` on the active link. Its `links`
array at the top of the file is the site navigation — adding a route means
adding a row there.

## Where a new page goes

1. `app/<route>/page.tsx` — default-export a Server Component, export
   `metadata`, wrap in `Container`, reuse `Card` / `ButtonLink`.
2. Add `{ href, label }` to the `links` array in `app/components/Nav.tsx`.
3. Add the page to the `pages` tuple in `__tests__/pageLandmarks.test.tsx`.
4. Add a `__tests__/<Name>Page.test.tsx` covering the page's own behavior.

<!-- last-verified: 2026-08-26 -->
