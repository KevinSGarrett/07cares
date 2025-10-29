# Search (MVP)

Server-rendered search using Typesense with a basic state facet.

## UI
- New page: `/search` with query form for `q` and `state`.
- Renders results SSR; no client-side API key exposure.

## Server
- Uses `getTypesense()` to connect with server env vars.
- Searches collection `campaigns` with `query_by: title,city,state`.

## Notes
- Ensure `TYPESENSE_HOST`, `TYPESENSE_API_KEY`, and protocol/port envs are set in the environment.
- Index campaigns via `POST /api/search/index-campaign` as needed.
