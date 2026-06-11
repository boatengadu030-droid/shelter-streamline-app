## Goal
Add a public-facing marketing website at `/` and move the existing admin app under `/dashboard/*`. Public visitors never see the dashboard; admins/staff sign in and go to `/dashboard`.

## Routing changes

Rename existing route files so the admin app lives under `/dashboard`:

```text
src/routes/index.tsx           -> src/routes/dashboard.index.tsx          (/dashboard)
src/routes/children.tsx        -> src/routes/dashboard.children.tsx
src/routes/inventory.tsx       -> src/routes/dashboard.inventory.tsx
src/routes/donations.tsx       -> src/routes/dashboard.donations.tsx
src/routes/compliance.tsx      -> src/routes/dashboard.compliance.tsx
src/routes/events.tsx          -> src/routes/dashboard.events.tsx
src/routes/staff.tsx           -> src/routes/dashboard.staff.tsx
src/routes/reports.tsx         -> src/routes/dashboard.reports.tsx
src/routes/documents.tsx       -> src/routes/dashboard.documents.tsx
```

Add a `src/routes/dashboard.tsx` layout that renders the sidebar shell + auth gate (moved out of `__root.tsx`). Update all sidebar links to `/dashboard/...`.

New public routes (no auth, public marketing site):

```text
src/routes/index.tsx       -> Home
src/routes/about.tsx
src/routes/programs.tsx
src/routes/sponsorship.tsx
src/routes/donate.tsx
src/routes/stories.tsx
src/routes/events-public.tsx -> /events  (renamed url segment to avoid clash; use /happenings or just /events since admin moved)
src/routes/volunteer.tsx
src/routes/contact.tsx
```

Since the admin events page is now `/dashboard/events`, the public route can simply be `src/routes/events.tsx` → `/events`.

## Public site shell

New `src/routes/_public.tsx` layout (pathless) with public Header + Footer wrapping all public pages. `__root.tsx` becomes minimal: just `<Outlet />` + Toaster + AuthProvider (no auth gating, no sidebar). Auth gate moves into the `dashboard` layout — unauthenticated visits to `/dashboard/*` show the existing `AuthPage`.

## Design system

Lavender/purple warm palette, white backgrounds, rounded cards, large display typography (Fraunces already loaded), Framer Motion micro-animations, lucide icons. Add CSS tokens to `src/styles.css` for lavender brand scale without touching existing dashboard tokens.

## Public components

- `src/components/site-header.tsx` — sticky nav (Home, About, Programs, Sponsorship, Stories, Events, Volunteer, Contact), Donate CTA, mobile sheet menu.
- `src/components/site-footer.tsx` — mission blurb, link columns, newsletter signup, socials, transparency links.
- `src/components/site/*` — Hero, ImpactStats, ApproachCards, ProgramCards, StoryCarousel, SponsorshipCTA, EventsPreview, TransparencyBlock, FinalCTA.

## Page content

Each public page gets per-route `head()` with unique title/description/og tags. Real copy from the prompt (mission, values, programs). Impact stats pull live numbers from existing `get_landing_stats` RPC where possible; static placeholders elsewhere with a note.

## What stays the same
- Backend, RLS, tables, auth flow.
- Dashboard functionality (all features preserved, just under `/dashboard`).
- Existing landing page component is retired (its hero/stats logic gets reused inside the new public Home).

## Out of scope (call out, don't build now)
- Real payment processing on `/donate` (we'll wire a "coming soon" / link button; ask before enabling Stripe).
- Blog CMS, multi-language, newsletter backend (UI only).
- Volunteer application persistence (form posts to a placeholder server fn that toasts success — ask before adding a table).
