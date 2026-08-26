# AOT-1 — Add pricing page

- **Issue:** [AOT-1](https://github.com/trozgan/ao-test/issues/1)
- **Branch:** `feature/aot-1`
- **Base SHA at planning time:** `d46242d`
- **Planning mode:** `pan plan --auto` (non-interactive; every inferred choice
  is recorded in `plan.autoDecisions[]` and in the Decisions section below)

---

## Headline finding — the feature already exists

Every functional requirement in the issue body is already satisfied by code on
`feature/aot-1`. This was verified against the working tree at `d46242d`, not
recalled. The PRD therefore does **not** re-specify the pricing page; it scopes
the delta that is genuinely missing.

| Issue requirement | Status | Evidence |
| --- | --- | --- |
| Use the existing Next.js App Router | Met | `app/pricing/page.tsx:58` default-exports a Server Component under `app/pricing/` |
| Create three pricing tiers | Met | `app/pricing/page.tsx:11-56` — `Starter`, `Team`, `Enterprise` |
| Add a link from the main navigation | Met | `app/components/Nav.tsx:10` — `{ href: "/pricing", label: "Pricing" }` |
| Reuse existing styling and components | Met | `app/pricing/page.tsx:2-4` imports `ButtonLink`, `Card`, `Container`; theme tokens only |
| Responsive | Met | `app/pricing/page.tsx:69` — `grid-cols-1 gap-6 md:grid-cols-3`, the same breakpoint `app/page.tsx:39` uses |
| Run lint | Passes | `npm run lint` → `✖ 1 problem (0 errors, 1 warning)`, exit 0 |
| Run the production build | Passes | `npm run build` → `✓ Compiled successfully`, `/pricing` listed as `○ (Static)` |
| Fix any introduced errors | Nothing to fix in project source | `npm test` → 10 files, 35 tests, all passing |

The page landed in `fe65fbf` (`feat(pricing): add /pricing page with three
tiers`) and was refined by `1fd31c1`, `09e9eb6`, `dbd38a7`, and `9317fa7`. It is
already covered by `__tests__/PricingPage.test.tsx` (three tiers, CTA hrefs,
the "Most popular" badge), by `__tests__/Nav.test.tsx` (the `/pricing` link and
its active state), and by `__tests__/pageLandmarks.test.tsx`.

**Consequence for the executor:** do not rewrite, restyle, or re-scaffold
`app/pricing/page.tsx`. Two work items follow, and neither touches it.

---

## Glossary

- **UI kit** — the four shared components in `app/components/` (`Container`,
  `Card`, `Button`, `ButtonLink`) plus `buttonStyles.ts`, the single source of
  the button variant classes.
- **Verification gates** — the three commands the issue names as
  requirements: `npm run lint`, `npm run build`, and (by repo convention)
  `npm test`.
- **Agent tooling directories** — `.claude/`, `.overdeck/`, and `.pan/`.
  Overdeck writes these into the workspace. They hold skills, transcripts,
  records, and planning artifacts. They are not application source.
- **`globalIgnores`** — the ESLint 9 flat-config helper imported in
  `eslint.config.mjs`. Calling it **replaces** the ignore set that
  `eslint-config-next` would otherwise contribute; it does not extend it.

---

## The remaining delta

### Problem 1 — `npm run lint` reports on files that are not project source

`eslint.config.mjs:9-15` lists only build outputs in `globalIgnores`. Because
that call replaces the framework defaults, ESLint walks the agent tooling
directories too. Running the gate on the current tree gives:

```
/Users/.../feature-aot-1/.claude/skills/stitch-react-components/examples/gold-standard-card.tsx
  20:10  warning  'cardData' is defined but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)
```

The warning comes from a vendored skill example that no one on this project
wrote or maintains. Exit status is 0, so nothing is blocked — the cost is that
a clean project diff cannot produce a clean lint report. The issue asks the
implementer to "run lint" and "fix any introduced errors"; with tooling noise
in the output, an agent cannot tell a real regression from vendored cruft, and
the honest answer to "is lint clean?" becomes "clean apart from a file we do
not own." Ignoring the tooling directories makes the gate mean what the issue
assumes it means.

### Problem 2 — `README.md` describes the scaffold, not this app

`README.md` is the untouched `create-next-app` output. Across its 36 lines it
names no route, no component, and neither `npm run lint` nor `npm test` — the
two gates the issue explicitly requires. Someone arriving at the repo cannot
learn that `/pricing` exists, that it carries three tiers, or how to check
their change before pushing. The pricing page is the site's primary conversion
surface and it is undocumented.

---

## Requirements

### Functional

- **FR-1** — `npm run lint`, run from the repository root on a clean tree,
  reports zero problems. No file under `.claude/`, `.overdeck/`, or `.pan/`
  appears in its output.
- **FR-2** — ESLint continues to report real problems in application source.
  A deliberate violation introduced under `app/` is still flagged.
- **FR-3** — `README.md` lists all four routes (`/`, `/about`, `/pricing`,
  `/contact`), and the `/pricing` entry names the three tiers `Starter`,
  `Team`, and `Enterprise`.
- **FR-4** — `README.md` documents the three verification commands
  (`npm run lint`, `npm test`, `npm run build`) and says what each one checks.
- **FR-5** — `README.md` points a contributor at the shared UI kit in
  `app/components/` and at the `links` array in `app/components/Nav.tsx` as the
  place a new route is registered.

### Non-functional

- **NFR-1** — No change to any file under `app/`. The shipped pricing page,
  nav, layout, and UI kit are untouched by this issue.
- **NFR-2** — No change to any file under `__tests__/`. The suite stays at 35
  passing tests.
- **NFR-3** — `npm run build` continues to compile and prerender all five
  routes (`/`, `/_not-found`, `/about`, `/contact`, `/pricing`) as static.

---

## Decisions made in this document

These are the choices `--auto` mode made in place of asking the operator. Each
is mirrored into `plan.autoDecisions[]`.

1. **Do not re-implement the pricing page.** The issue's functional
   requirements are already met and covered by tests. Rewriting working, tested
   code to satisfy the letter of a stale issue would risk regression for no
   user-visible gain. The plan scopes only the verified gaps.
2. **Fix the lint gate by ignoring tooling directories, not by editing the
   vendored file.** `.claude/skills/**` is distributed by `pan sync` and is
   overwritten on the next sync, so a fix inside it does not survive. The
   config change is durable and states the intent — these directories are not
   project source.
3. **Ignore all three tooling directories, not only `.claude/`.** `.overdeck/`
   and `.pan/` hold transcripts, records, and planning artifacts, and can
   acquire lintable files at any time. Listing one and omitting the others
   invites the same warning back from a different directory.
4. **Rewrite the README rather than appending to it.** The boilerplate sections
   ("Getting Started", "Learn More", "Deploy on Vercel") describe the scaffold,
   not this app. Appending a routes table below them leaves the misleading
   material in place as the first thing a reader sees.
5. **Do not add a CI workflow.** `.github/` does not exist and nothing enforces
   the gates automatically. That is a real weakness, recorded in
   `.pan/context/codebase/concerns.md`, but adding CI is outside "Add pricing
   page" and belongs in its own issue.
6. **Do not add a responsive-layout test.** `/pricing` uses the same
   `md:grid-cols-3` breakpoint as the already-shipped home page, and every test
   in this repo queries by role and accessible name. Asserting Tailwind class
   strings would be the suite's first off-convention test and would pin markup
   rather than behavior.

No contradiction was found between the issue body and the codebase, so planning
did not halt. The gap between the issue's framing ("create a pricing page") and
the repository state (it exists) is a staleness mismatch, not a conflict
between authoritative inputs.

---

## Work items

### Item 1 — Scope the ESLint gate to project source

**What and why.** Add the agent tooling directories to `globalIgnores` so
`npm run lint` reports on application code only, and the issue's "run lint /
fix any introduced errors" requirement has an unambiguous answer.

**Files touched:** `eslint.config.mjs` (the `globalIgnores` array only).

**Steps.**

1. Open `eslint.config.mjs`.
2. Extend the `globalIgnores([...])` array at lines 9-15 with the three tooling
   directories and a comment saying why.
3. Run `npm run lint` and confirm it prints no problems.
4. Confirm the ignore is not over-broad by introducing a temporary unused
   variable in `app/pricing/page.tsx`, running `npm run lint`, seeing it
   flagged, and reverting it. Do not commit that edit.

**Before** (`eslint.config.mjs:9-15`):

```js
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
```

**After:**

```js
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent tooling written into the workspace by Overdeck. Distributed by
    // `pan sync` and not project source, so lint findings here are noise.
    ".claude/**",
    ".overdeck/**",
    ".pan/**",
  ]),
```

**Traces:** FR-1, FR-2, NFR-1, NFR-2.

**Proof:** `npm run lint` exits 0 and prints no `✖ N problems` line.

### Item 2 — Replace the boilerplate README with a project guide

**What and why.** Give a contributor a true picture of the site: what routes
exist, what `/pricing` contains, which components to reuse, and how to verify a
change. This is the documentation work item the PRD standard requires.

**Files touched:** `README.md` (rewritten). No other file.

**Steps.**

1. Replace the whole file. Keep a short "Getting Started" with `npm install`
   and `npm run dev`; drop the yarn/pnpm/bun variants, the "Learn More"
   section, and the "Deploy on Vercel" section.
2. Add a `## Routes` section as a table with `Route`, `File`, and `What it
   contains` columns, listing `/` → `app/page.tsx`, `/about` →
   `app/about/page.tsx`, `/pricing` → `app/pricing/page.tsx`, and `/contact` →
   `app/contact/page.tsx`. The `/pricing` row must name `Starter`, `Team`, and
   `Enterprise`.
3. Add a `## Components` section describing `Container`, `Card`, `Button`,
   `ButtonLink`, and `buttonStyles.ts`, and stating that button appearance is
   changed in `buttonStyles.ts` rather than in the components.
4. Add a `## Adding a route` section: create `app/<route>/page.tsx`, add a row
   to the `links` array in `app/components/Nav.tsx`, add the page to the
   `pages` tuple in `__tests__/pageLandmarks.test.tsx`, add a test file.
5. Add a `## Verifying a change` section listing the three commands with one
   sentence each: `npm run lint` (ESLint over application source),
   `npm test` (Vitest, jsdom, one run), `npm run build` (production build,
   which also runs the TypeScript check).

**Traces:** FR-3, FR-4, FR-5, NFR-1, NFR-2.

**Proof:** `grep` finds `/pricing`, `Starter`, `Team`, `Enterprise`,
`npm run lint`, `npm test`, and `npm run build` in `README.md`, and finds no
`Deploy on Vercel` heading.

### Documentation coverage

Item 2 **is** the documentation work item. `README.md` is the only documented
surface this repository has — there is no `docs/` directory, no Mintlify site,
and no rule file describing the app. The codebase map at
`.pan/context/codebase/` (`architecture.md`, `conventions.md`, `concerns.md`,
`stack.md`) was bootstrapped during this planning session and is committed by
`pan plan finalize`, so it is not a work item.

---

## Acceptance criteria

| # | Criterion | Item | How it is checked |
| --- | --- | --- | --- |
| AC-1 | `npm run lint` exits 0 and prints no problem count | 1 | Run the command |
| AC-2 | Lint output names no file under `.claude/`, `.overdeck/`, or `.pan/` | 1 | Run the command |
| AC-3 | A temporary unused variable in `app/pricing/page.tsx` is still flagged | 1 | Add, run lint, revert |
| AC-4 | `README.md` lists all four routes with their file paths | 2 | Read the file |
| AC-5 | The `/pricing` row names `Starter`, `Team`, and `Enterprise` | 2 | `grep` the file |
| AC-6 | `README.md` documents `npm run lint`, `npm test`, and `npm run build` | 2 | `grep` the file |
| AC-7 | `README.md` no longer carries the `Deploy on Vercel` section | 2 | `grep` the file |
| AC-8 | `git diff --name-only main` touches no file under `app/` or `__tests__/` | 1, 2 | Run the command |
| AC-9 | `npm test` still reports 35 passing tests in 10 files | 1, 2 | Run the command |
| AC-10 | `npm run build` compiles and lists `/pricing` as `○ (Static)` | 1, 2 | Run the command |

---

## Out of scope

- Rewriting, restyling, or re-scaffolding `app/pricing/page.tsx`.
- Changing tier names, prices, feature lists, or CTA targets.
- Any change under `app/` or `__tests__/`.
- Adding a CI workflow or a `.github/` directory.
- Adding Playwright, any end-to-end harness, or a responsive-layout test.
- Editing the vendored file under `.claude/skills/` that currently trips the
  lint warning.
- Extracting the hardcoded `tiers` array into a data module or CMS.
- Changing the `AGENTS.md` block that `next dev` regenerates.

---

## Planning Q&A

None. This session ran under `pan plan --auto`, which forbids
`AskUserQuestion`. Every point at which an interactive session would have asked
the operator is recorded as a numbered entry under "Decisions made in this
document" above and mirrored into `plan.autoDecisions[]` in the xBRIEF.

The one question worth flagging for a human, had the mode allowed it: *the
issue asks for a pricing page that already exists and passes every gate —
should AOT-1 simply be closed as already-done instead of shipping the two
cleanup items?* Auto mode chose to ship the delta rather than close the issue,
because closing a tracker issue is an operator decision and the two items are
independently defensible on their own merits.
