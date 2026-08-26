# AOT-2 — Add user profile settings with validation

- **Issue:** [AOT-2](https://github.com/trozgan/ao-test/issues/2)
- **Branch:** `feature/aot-2`
- **Baseline commit:** `fdf7000`
- **Planning mode:** `pan plan --auto` (no operator questions; every default is
  recorded in `plan.autoDecisions[]` and in "Decisions made in this document")

## Glossary

| Term | Meaning in this document |
| --- | --- |
| **Route handler** | A Next.js App Router `app/**/route.ts` file exporting named HTTP-method functions. See `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`. |
| **Repository** | A module that owns storage of profile records and nothing else. No validation, no HTTP. Here: an in-process object. |
| **Service** | A module that composes validation and the repository into one save operation and returns a result the caller can branch on. No HTTP, no React. |
| **Validation module** | A pure function plus its types and the timezone list. Imported by both the browser form and the server route so the two cannot drift. |
| **`ProfileInput`** | `{ name: string; email: string; timezone: string }` — the three fields the issue names. |
| **`ProfileErrors`** | `Partial<Record<keyof ProfileInput, string>>` — a field-keyed map of human-readable messages. Empty object means valid. |
| **Gate** | One of the three verification commands: `npm run lint`, `npm test`, `npm run build`. |
| **The map** | `.pan/context/codebase/{architecture,conventions,concerns,stack}.md`, bootstrapped during this planning session. |

## Problem

The issue asks for a `/settings/profile` route with a reusable profile form,
client-side validation on name / email / timezone, an API endpoint that saves
through a repository-or-service layer rather than inline route logic, clear
success and validation-error states, a nav link, and tests for invalid email,
missing required fields, and a successful save.

None of it exists at `fdf7000`. Verified:

- `app/` contains four page files and five component files; there is no
  `app/settings/`, no `app/api/`, and no `app/lib/`
  (`find app -type f`, 2026-08-26).
- `app/components/Nav.tsx:7-12` lists exactly four links: `/`, `/about`,
  `/pricing`, `/contact`.
- `next build` at `fdf7000` prerenders exactly `/`, `/_not-found`, `/about`,
  `/contact`, `/pricing`.
- No file in the repo contains `"use client"` other than
  `app/components/Nav.tsx:1`, and no component holds `useState`
  (`grep -rn "useState\|use client" app/`).

Three properties of the existing tree decide how the work has to be sequenced,
and each one silently breaks a naive implementation:

1. **`vitest.config.mts:9` sets `include: ["__tests__/**/*.test.tsx"]`.** A
   validation, repository, service, or route-handler test written as
   `__tests__/foo.test.ts` is never collected. `npm test` still exits 0 and
   prints a green summary, so the missing coverage reads as success.
2. **`__tests__/Nav.test.tsx:38-60` asserts the nav link list exactly** —
   `toEqual(["Home", "About", "Pricing", "Contact"])` and
   `expect(screen.getAllByRole("link")).toHaveLength(5)`. Adding a fifth nav
   entry fails that file unless the same commit updates it. The comment on
   line 41 says this is deliberate.
3. **`@testing-library/user-event` is not installed** (`package.json`
   `devDependencies`). Interaction tests must use `fireEvent` from
   `@testing-library/react`, as the existing suite does.

One ambiguity was resolved empirically during planning rather than left to the
work agent: Web `Request`, `Response`, `Response.json()`, and `fetch` are all
available in this vitest jsdom environment. A throwaway probe constructed a
`Request` with a JSON body, read it back with `await req.json()`, and built a
`Response.json({...}, { status: 400 })` — all without a `ReferenceError`.
**Route-handler tests therefore need no `@vitest-environment node` pragma.**

## Proposal

Ship the feature as a chain of small vertical slices, each independently
reviewable and each leaving the tree green.

The persistence path is a three-module stack under `app/lib/profile/`, which is
this repo's first non-component module directory:

```
validation.ts   pure: ProfileInput, ProfileErrors, TIMEZONES, validateProfile()
repository.ts   in-process storage: getProfile(), saveProfile(), resetProfile()
service.ts      composes both: saveUserProfile() -> { ok: true } | { ok: false }
```

`app/api/profile/route.ts` is a thin POST handler: coerce the JSON body to
`ProfileInput`, call `saveUserProfile`, map `ok: false` to HTTP 400 with the
error map and `ok: true` to HTTP 200 with the saved profile. No validation
logic and no storage logic live in the route file — that is the "small
repository/service layer" the issue asks for.

`app/components/ProfileForm.tsx` is the reusable client component. It imports
the same `validateProfile` the server uses, so a rule can never be enforced in
one place and not the other. It validates on submit, renders per-field error
text, and only issues the `fetch` when the client-side check is clean.
`app/settings/profile/page.tsx` is a thin Server Component that mounts it,
matching how every other page in the repo is written.

Sequencing is driven by the two traps above: the vitest glob widens **first**,
because five of the later items add `.test.ts` files; the nav link and its test
update land **together** in one item.

## Decisions made in this document

Auto mode means no operator questions. Each choice below is final for this
issue; the work agent implements it as written and does not re-litigate.

- **D-1 — No new runtime dependencies.** No `zod`, no `react-hook-form`, no
  `@testing-library/user-event`. `package.json` has three runtime deps and the
  issue says "keep the implementation simple and consistent with the existing
  project architecture". Hand-written validation over three fields is ~20
  lines.
- **D-2 — Email is checked with `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.** It rejects
  the cases a user actually hits (no `@`, no domain, no dot, embedded spaces)
  without pretending to implement RFC 5322. Full correctness is a NonGoal.
- **D-3 — Timezone is a `<select>` over a fixed list.** `TIMEZONES` is a
  six-entry `as const` array in `validation.ts`. The empty option is the
  invalid state, so "timezone is required" is enforceable identically on client
  and server. `Intl.supportedValuesOf("timeZone")` would return several hundred
  entries and make tests environment-dependent.
- **D-4 — Persistence is one module-level variable holding a single profile.**
  The issue says mock persistence is acceptable. There is no auth and no user
  identity in this app, so there is nothing to key a record by.
  `resetProfile()` exists purely as a test seam.
- **D-5 — `POST /api/profile` only. No `GET`.** The issue asks for "a simple
  API endpoint for saving profile data". The form starts from empty defaults
  and does not hydrate saved values; hydration is a NonGoal.
- **D-6 — A malformed or non-object JSON body is treated as three empty
  fields**, producing the ordinary 400 validation-error map. This avoids a
  second error shape for a case the browser form cannot produce, and it keeps
  `ProfileErrors` keyed only by field name.
- **D-7 — Validation runs on submit, not on change or blur.** The three
  required test cases are all submit-driven, and on-change validation would
  flag a field the user has not finished typing.
- **D-8 — The vitest glob widens to `__tests__/**/*.test.{ts,tsx}`** rather
  than naming every non-JSX test `.tsx`. One line of config beats a convention
  that every future contributor has to be told about.
- **D-9 — `README.md` gets an appended section, not a rewrite.** AOT-1 plans a
  full README rewrite on a sibling branch; appending keeps the two mergeable.
- **D-10 — The map (`.pan/context/codebase/`) was bootstrapped during this
  planning session**, not as a work item. `pan plan finalize` commits it.
- **D-11 — No browser/Playwright verification.** Every acceptance criterion in
  this plan is checkable from the diff, `npm test`, `npm run lint`, or
  `npm run build`. No item requires a running server.

## Requirements

### Functional

- **FR-1** — `/settings/profile` renders a profile settings page with an `<h1>`
  reading "Profile Settings".
- **FR-2** — A reusable `ProfileForm` component renders labelled `name`,
  `email`, and `timezone` inputs.
- **FR-3** — Client-side validation rejects an empty `name`, rejects an empty
  or malformed `email`, and rejects an unselected `timezone`, showing a message
  per offending field.
- **FR-4** — A submit that fails client-side validation does not issue a
  network request.
- **FR-5** — `POST /api/profile` saves a valid profile and returns it with
  status 200.
- **FR-6** — `POST /api/profile` returns status 400 and a field-keyed error map
  for an invalid body, and stores nothing.
- **FR-7** — Persistence goes through a repository module; the route handler
  contains no storage or validation logic.
- **FR-8** — A successful save renders a visible success message.
- **FR-9** — The main navigation links to `/settings/profile`.
- **FR-10** — Tests cover invalid email, missing required fields, and a
  successful save.
- **FR-11** — `README.md` documents the route, the endpoint contract, and the
  mock-persistence caveat.

### Non-functional

- **NFR-1** — No new runtime or dev dependency is added to `package.json`.
- **NFR-2** — `npm run lint` reports zero errors and no new warning beyond the
  one pre-existing tooling warning documented in the map.
- **NFR-3** — `npm run build` completes, including the TypeScript check.
- **NFR-4** — Every new test file is actually collected by `npm test`; the
  reported test-file count rises with each item that adds one.
- **NFR-5** — Client and server enforce the same validation rules by importing
  the same function; no rule is duplicated.
- **NFR-6** — Form controls are reachable by accessible name, and error and
  success text are exposed to assistive technology.
- **NFR-7** — No file under `app/about/`, `app/pricing/`, `app/contact/`, or
  `app/page.tsx` changes.

## Work items

### 1. Widen the vitest include glob to collect `.test.ts`

**What/why.** Items 2-5 each add a non-JSX test file. At the current glob those
files are silently skipped and the suite still reports green — the exact
failure mode recorded in the map's concerns file. This must land first.

**Files:** `vitest.config.mts`.

Before (`vitest.config.mts:5-11`):

```ts
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.tsx"],
  },
```

After:

```ts
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
  },
```

**Proof.** `npm test` still reports 10 files / 35 tests (nothing existing is
lost). Item 2's test file is the first one to demonstrate collection.

### 2. Add the profile validation module

**What/why.** The shared contract both the form and the route import (NFR-5).
Every later item consumes its types, so it lands second and carries the
inspection gate.

**Files:** `app/lib/profile/validation.ts` (new),
`__tests__/profileValidation.test.ts` (new).

```ts
// app/lib/profile/validation.ts
export type ProfileInput = {
  name: string;
  email: string;
  timezone: string;
};

export type ProfileErrors = Partial<Record<keyof ProfileInput, string>>;

export const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Budapest",
  "Asia/Tokyo",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProfile(input: ProfileInput): ProfileErrors {
  const errors: ProfileErrors = {};

  if (input.name.trim() === "") {
    errors.name = "Name is required.";
  }

  const email = input.email.trim();
  if (email === "") {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (input.timezone === "") {
    errors.timezone = "Timezone is required.";
  } else if (!TIMEZONES.includes(input.timezone as (typeof TIMEZONES)[number])) {
    errors.timezone = "Choose a timezone from the list.";
  }

  return errors;
}
```

**Test cases** (`__tests__/profileValidation.test.ts`): a fully valid input
returns `{}`; an empty `name` returns `errors.name`; `""`, `"nope"`, and
`"a@b"` each return `errors.email`; a valid address returns no `email` key; an
empty `timezone` and an off-list `timezone` each return `errors.timezone`; an
all-empty input returns all three keys.

### 3. Add the profile repository

**What/why.** FR-7 — storage isolated from HTTP and from validation. D-4 fixes
the shape: one module-level record.

**Files:** `app/lib/profile/repository.ts` (new),
`__tests__/profileRepository.test.ts` (new).

```ts
// app/lib/profile/repository.ts
import type { ProfileInput } from "./validation";

let storedProfile: ProfileInput | null = null;

export function getProfile(): ProfileInput | null {
  return storedProfile;
}

export function saveProfile(profile: ProfileInput): ProfileInput {
  storedProfile = { ...profile };
  return storedProfile;
}

// Test seam: module-level state survives between tests in a file.
export function resetProfile(): void {
  storedProfile = null;
}
```

**Test cases:** `getProfile()` is `null` before any save; `saveProfile()`
returns the saved record and a following `getProfile()` returns the same field
values; a second `saveProfile()` replaces the first; mutating the object passed
to `saveProfile` afterwards does not change what `getProfile()` returns (the
spread copy); `resetProfile()` returns storage to `null`. Call `resetProfile()`
in `beforeEach`.

### 4. Add the profile service

**What/why.** FR-7 — one call the route can make, returning a result it can
branch on without knowing the validation or storage rules.

**Files:** `app/lib/profile/service.ts` (new),
`__tests__/profileService.test.ts` (new).

```ts
// app/lib/profile/service.ts
import { saveProfile } from "./repository";
import { validateProfile, type ProfileErrors, type ProfileInput } from "./validation";

export type SaveProfileResult =
  | { ok: true; profile: ProfileInput }
  | { ok: false; errors: ProfileErrors };

export function saveUserProfile(input: ProfileInput): SaveProfileResult {
  const errors = validateProfile(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, profile: saveProfile(input) };
}
```

**Test cases:** a valid input returns `ok: true` with the profile and
`getProfile()` then returns it; an invalid email returns `ok: false` with
`errors.email` **and** leaves `getProfile()` at `null`; an all-empty input
returns `ok: false` with all three error keys. `resetProfile()` in
`beforeEach`.

### 5. Add the `POST /api/profile` route handler

**What/why.** FR-5, FR-6. The HTTP edge, and nothing else.

**Files:** `app/api/profile/route.ts` (new),
`__tests__/profileApiRoute.test.ts` (new).

```ts
// app/api/profile/route.ts
import { saveUserProfile } from "@/app/lib/profile/service";

function asField(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const record = (body ?? {}) as Record<string, unknown>;
  const result = saveUserProfile({
    name: asField(record.name),
    email: asField(record.email),
    timezone: asField(record.timezone),
  });

  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }

  return Response.json({ profile: result.profile }, { status: 200 });
}
```

Note the `@/` alias import — the repo's established convention
(`tsconfig.json` `paths`).

**Test cases:** build a `new Request("http://localhost/api/profile", { method:
"POST", body: JSON.stringify(...) })` and call the exported `POST` directly. A
valid body gives status 200 and `{ profile: {...} }`; an invalid email gives
400 and `errors.email`, with `getProfile()` still `null`; an empty object body
gives 400 with all three error keys; a malformed body (`body: "not json"`)
gives 400 with all three error keys (D-6). `resetProfile()` in `beforeEach`.

### 6. Add the reusable `ProfileForm` component

**What/why.** FR-2, FR-3, FR-4, FR-8. The largest item, but indivisible: the
error states, the success state, and the submit guard are one state machine.

**Files:** `app/components/ProfileForm.tsx` (new),
`__tests__/ProfileForm.test.tsx` (new).

Shape (`"use client"`, the repo's second client component):

- State: `values: ProfileInput` (all `""` initially), `errors: ProfileErrors`,
  `status: "idle" | "saving" | "saved"`.
- `onSubmit`: `event.preventDefault()`; run `validateProfile(values)`; if the
  map is non-empty, `setErrors` and **return without calling `fetch`** (FR-4);
  otherwise `setStatus("saving")` and
  `fetch("/api/profile", { method: "POST", headers: { "Content-Type":
  "application/json" }, body: JSON.stringify(values) })`. A non-ok response
  sets `errors` from the response body; an ok response clears `errors` and sets
  `status` to `"saved"`.
- Markup: `<form>` with three `<label htmlFor>` + control pairs — text input
  for name, `type="email"` input for email, `<select>` for timezone with a
  leading `<option value="">Select a timezone</option>` followed by
  `TIMEZONES.map(...)`. Each control gets `aria-invalid` when its field has an
  error and `aria-describedby` pointing at a `<p role="alert" id="...-error">`
  holding the message. The success message is a `<p role="status">` reading
  "Profile saved.". Submit is `<Button type="submit">Save profile</Button>`
  (reuse, per the map's conventions).
- Editing a field clears that field's error and resets `status` to `"idle"`, so
  the success banner does not linger over a changed form.

**Test cases** (`fireEvent`, not `user-event` — D-1):

- Submitting with every field empty renders three alerts including "Name is
  required." and "Timezone is required.", and `fetch` (a `vi.fn()` assigned to
  `global.fetch`) is not called.
- Filling name and timezone but entering `"nope"` as the email renders "Enter a
  valid email address." and `fetch` is not called.
- Filling all three validly calls `fetch` once with `"/api/profile"`, a `POST`
  method, and a JSON body carrying the three values, and then
  `await screen.findByRole("status")` shows "Profile saved.".
- A 400 response with `{ errors: { email: "..." } }` renders that server
  message.

Reset `global.fetch` in `afterEach`.

### 7. Add the `/settings/profile` page

**What/why.** FR-1. A thin Server Component matching `app/about/page.tsx`.

**Files:** `app/settings/profile/page.tsx` (new),
`__tests__/ProfileSettingsPage.test.tsx` (new),
`__tests__/pageLandmarks.test.tsx` (edit).

```tsx
// app/settings/profile/page.tsx
import type { Metadata } from "next";
import Container from "../../components/Container";
import ProfileForm from "../../components/ProfileForm";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Update the name, email, and timezone on your Northwind profile.",
};

export default function ProfileSettings() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Profile Settings
      </h1>
      <p className="mt-6 max-w-prose text-lg leading-8 text-foreground/70">
        Changes apply to how your name appears across Northwind and where
        scheduled work lands in your day.
      </p>
      <ProfileForm />
    </Container>
  );
}
```

`__tests__/pageLandmarks.test.tsx` gains
`["Profile Settings", ProfileSettings]` in its `pages` tuple (line 15-20), so
the new page is covered by the "does not render a nav landmark of its own"
assertion like the other four.

### 8. Link Profile Settings from the main navigation

**What/why.** FR-9 — and the exact-count nav test must move with it, which is
why this is its own item.

**Files:** `app/components/Nav.tsx` (edit), `__tests__/Nav.test.tsx` (edit).

`app/components/Nav.tsx:7-12` gains a fifth row:

```ts
const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/settings/profile", label: "Profile Settings" },
];
```

Three edits in `__tests__/Nav.test.tsx`:

- the `renders links to ...` test gains an assertion that the "Profile
  Settings" link has `href="/settings/profile"`;
- `toEqual([...])` at line 46-51 gains `"Profile Settings"`, and
  `toHaveLength(5)` at line 59 becomes `toHaveLength(6)` (five nav links plus
  the brand anchor);
- the `test.each` table at line 62-67 gains
  `["/settings/profile", "Profile Settings"]`.

### 9. Document the feature in the README

**What/why.** FR-11, and the plan's required documentation item. Appended, not
rewritten (D-9).

**Files:** `README.md` (edit).

Append a `## Profile settings` section covering: the route
`/settings/profile`; the `ProfileForm` component and that it is reusable; the
`POST /api/profile` contract (request body shape, 200 response
`{ profile }`, 400 response `{ errors }` keyed by field name); the
`app/lib/profile/` module split and which module owns which concern; and an
explicit caveat that persistence is a single in-process record that resets when
the server restarts and is shared by every visitor.

### 10. Run every gate and clear regressions

**What/why.** The issue asks explicitly for lint, tests, and the production
build to be run and any introduced error fixed. Baseline to beat is recorded in
the map's concerns file.

**Files:** any file introduced by items 1-9 that a gate flags.

Run `npm run lint`, `npm test`, `npm run build`. Expected end state: lint has
0 errors and only the one pre-existing tooling warning; the suite reports 16
test files with every test passing; the build completes the TypeScript check
and its route table lists `/settings/profile` and `/api/profile` alongside the
five baseline routes.

## Acceptance criteria

| # | Item | Criterion |
| --- | --- | --- |
| AC-1 | 1 | `vitest.config.mts` include glob matches `.test.ts`, and `npm test` still reports 10 files / 35 tests passing. |
| AC-2 | 2 | `npm test` collects `__tests__/profileValidation.test.ts` (file count rises to 11) and it passes. |
| AC-3 | 2 | `validateProfile` returns `{}` for a valid input and a keyed message for each of empty name, malformed email, and unselected timezone. |
| AC-4 | 3 | `saveProfile` then `getProfile` returns the saved values; `resetProfile` returns storage to `null`. |
| AC-5 | 4 | `saveUserProfile` returns `{ ok: false, errors }` for an invalid input and leaves `getProfile()` at `null`. |
| AC-6 | 5 | `POST` returns 200 with `{ profile }` for a valid body and 400 with `{ errors }` for an invalid or malformed one. |
| AC-7 | 5 | `app/api/profile/route.ts` contains no regex, no validation branch, and no storage variable — it only coerces, delegates, and maps status codes. |
| AC-8 | 6 | An empty submit renders an alert per field and does not call `fetch`. |
| AC-9 | 6 | A valid submit calls `fetch("/api/profile", ...)` once with a POST and renders "Profile saved.". |
| AC-10 | 7 | Rendering the page shows an `<h1>` "Profile Settings" and the form's three labelled controls, and no `navigation` landmark. |
| AC-11 | 8 | `Nav` renders a "Profile Settings" link to `/settings/profile`, six links total, and marks it current on that path. |
| AC-12 | 9 | `README.md` states the `/settings/profile` route, both `POST /api/profile` status codes, and that persistence resets on restart. |
| AC-13 | 10 | `npm run build` completes and its route table lists `/settings/profile` and `/api/profile`. |
| AC-14 | 10 | `npm run lint` exits 0 with no error and no warning outside `.claude/`. |

## NonGoals

- No real database, file, cookie, or `localStorage` persistence.
- No authentication, authorization, session, or per-user profile record.
- No `GET /api/profile` and no hydration of saved values into the form.
- No new runtime or dev dependency.
- No `zod` or other schema library; no `react-hook-form`.
- No RFC-5322-complete email validation and no MX/deliverability check.
- No full IANA timezone list and no timezone auto-detection.
- No server actions; the form posts to the route handler.
- No avatar upload, password change, or notification preferences.
- No changes to `/`, `/about`, `/pricing`, or `/contact` page content.
- No fix for the pre-existing ESLint tooling warning (AOT-1 owns it).
- No README rewrite (AOT-1 owns it); append only.
- No CI workflow.
- No Playwright or browser-based verification.

## Planning Q&A

None. This session ran under `pan plan --auto`, which forbids
`AskUserQuestion`. Every question that would have been asked is answered in
"Decisions made in this document" above and mirrored into
`plan.autoDecisions[]` in `.overdeck/spec.vbrief.json`.
