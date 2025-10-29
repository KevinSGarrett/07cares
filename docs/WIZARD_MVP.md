# Campaign Wizard (MVP)

This PR adds a two-step Campaign Wizard and Cloudinary cover uploads.

- Auth: Local dev runs with `AUTH_BYPASS=true` and shows a small banner. Staging enables Clerk once envs are set.
- Step 1 (Basics): Title, City/State, Goal (USD), Dates → creates draft via `POST /api/campaign/create`.
- Step 2 (Media): Cover upload using signed request from `POST /api/cloudinary/sign`, then saves `coverUrl` via `POST /api/campaign/:id/update`. Publish requires a cover.

## Endpoints
- POST `/api/campaign/create` → create draft (status=draft)
- POST `/api/campaign/:id/update` → partial update (incl. `coverUrl`)
- POST `/api/campaign/:id/publish` → validate and set status=live

## Local Setup
- Ensure Postgres is running and `DATABASE_URL` is set.
- Cloudinary: set `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME` in env (server-only).
- Keep `AUTH_BYPASS=true` in `.env.local` for local dev.

## Usage
- Visit `/portal/campaigns/new` to create a campaign.
- After publish, follow the link to `/c/[slug]`.

## Tests
- Unit tests for `slugify` and campaign schemas.

## TODO (follow-up PRs)
- Wizard validation states and a11y polish
- Organizer auth with Clerk on staging
- Gallery uploads (multiple assets) and reorder
- Screenshots: add to this doc and PR description
