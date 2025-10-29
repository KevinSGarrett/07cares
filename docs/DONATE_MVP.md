# Donate Flow (MVP)

Minimal Stripe Elements donate widget embedded on the campaign page.

## UI
- Added `DonateWidget` to `src/app/c/[slug]/DonateWidget.tsx` and rendered from the campaign page.
- Amount input (USD), Payment Element, success message.

## API
- Uses existing `POST /api/donate/create-intent` endpoint.

## Env
- Requires `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client) and `STRIPE_SECRET_KEY` (server).

## Notes
- Redirect is `if_required`; most cards will complete without redirect in test mode.
- Webhook already records donations (ensure webhook secret configured in staging).
