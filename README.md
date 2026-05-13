# Raw Skills FC - Website

Modern Next.js 15 + Payload CMS v3 website for [rawskillsfc.com](https://rawskillsfc.com).

Built so that volunteer team managers can edit their own age-group page (squad, fixtures, results, news, gallery) without touching code, while admins control club-wide content and season roll-overs.

## Stack

- **Frontend & API:** Next.js 15 (App Router, RSC, TypeScript)
- **CMS:** Payload v3 (self-hosted, lives in the same Next.js app, admin at `/admin`)
- **DB:** Postgres (Neon recommended for hosted dev/prod)
- **Media:** Cloudflare R2 (S3-compatible), Next.js Image
- **Styling:** Tailwind CSS + brand tokens sampled from the club crest
- **Hosting:** Vercel (Cloudflare DNS in front, DNS-only / grey-cloud)
- **Forms:** Cloudflare Turnstile + Resend (transactional email)

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env
# fill DATABASE_URI, PAYLOAD_SECRET, S3_* (R2), TURNSTILE_*, RESEND_*

# 3. Push DB schema + seed admin + age groups + current season
npm run dev           # leave running in one terminal (auto-migrates)
# in another terminal:
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='YourStrongPwd!' npm run seed

# 4. Optimise the seed photos (optional)
npm run optimise:photos
```

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>
- REST API: <http://localhost:3000/api>

## Season flexibility (how it works)

Teams and the number of age groups can change every summer without code changes.

- `Seasons` collection: one row per season, exactly one with `isCurrent: true`. Public pages default to the current season.
- `AgeGroups` collection: admin-editable list. Add "Girls U14", "Vets", "Walking Football" any time.
- `Teams`: each team belongs to a `season` and an `ageGroup`. Adding/removing teams is just admin CRUD.
- **Season roll-over endpoint** (`POST /api/seasons/rollover`, admin only): clones every team from a source season into a new season, optionally bumping `ageGroup` up one rung, and links `previousTeam` for history. New season is created as draft (`isCurrent: false`) so you can edit before flipping live.
- `teamManager` users may only edit their own team in the **current** season; historical seasons are immutable to non-admins.

Example payload:

```json
POST /api/seasons/rollover
{
  "sourceSeasonId": "<uuid>",
  "newSeasonLabel": "2026/27",
  "newStartDate": "2026-08-01",
  "newEndDate": "2027-06-30",
  "bumpAgeGroups": true,
  "teamOverrides": [
    { "teamId": "<uuid-of-u18-team>", "skip": true }
  ]
}
```

## Project layout

```
src/
  access/               role-based access helpers
  collections/          Payload collections (Seasons, AgeGroups, Teams, ...)
  globals/              Payload globals (Settings)
  endpoints/            Custom Payload REST endpoints (rollover)
  lib/                  Server helpers (payload client, getCurrentSeason)
  app/
    (frontend)/         Public site
    (payload)/          Payload admin & REST API
  payload.config.ts     Payload config (collections, db, storage)
scripts/
  optimise-photos.ts    Resize originals -> WebP/AVIF
  seed.ts               First-run seed (admin, age groups, season, settings)
photos/                 Source photos (gitignored, ~140MB of originals)
photos_optimised/       Generated output (gitignored)
```

## Roles

- **admin** - full access, runs season roll-over, manages users.
- **editor** - manages club-wide content (news, pages, sponsors, soccer school).
- **teamManager** - logs in and edits their assigned team (fixtures, results, news, gallery) in the **current season only**.

## Brand

Tokens are in `tailwind.config.ts`:

- Club red `#D7261E`, dark red `#A81912`
- Club black `#1B1A18`
- Off-white `#F5F2EC`
- Accent (CTAs) `#C6FF3D`

Display font: Anton (fallback Bebas Neue). Body: Inter.

The current crest (`photos/RAW-SKILLS-FC-LOGO.jpg`) is raster - vectorise to `brand/raw-skills-crest.svg` before launch.

## Deployment

1. Push repo to GitHub.
2. Create Vercel project, link the repo.
3. Add env vars from `.env.example` (Vercel -> Project Settings -> Environment Variables).
4. Set up Neon Postgres, paste `DATABASE_URI`.
5. Set up Cloudflare R2 bucket + access keys, fill `S3_*`. Map a custom domain `media.rawskillsfc.com` to the bucket.
6. Add `rawskillsfc.com` to the Vercel project. In Cloudflare DNS, add the records Vercel gives you with **proxy disabled** (grey cloud).
7. Trigger first deploy. After it boots, run the seed (`npm run seed` against the production DB, or invoke the script via a one-off Vercel cron / locally with the prod `DATABASE_URI`).
8. Sign in at `/admin`, mark the new season as current, add teams + team-manager users.

## Open tasks (handoff)

- Vectorise the crest to SVG + dark/mono variants.
- Add Pages content for About / Policies / Safeguarding.
- Wire Cloudflare Turnstile widget to the contact form (currently server-verified, client widget pending).
- Add the season roll-over admin UI button (calls the endpoint above; endpoint is functional today via `curl` / Postman).
- Add `/news/[slug]`, `/soccer-school`, `/sponsors`, `/join`, `/about`, `/policies` page routes (stubs only currently).
- Confirm GDPR/consent for any photos before publishing - especially any showing identifiable U18 players.
