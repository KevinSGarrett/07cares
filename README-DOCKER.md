# Fundraise Docker Kit

This kit provides **docker-compose** services for local development:
- **Postgres 15** at `localhost:5432`
- **Typesense 0.25.2** at `http://localhost:8108` (API key: `xyz` by default)

## Files
- `docker-compose.yml` — services definition
- `.env.local.docker` — ready-to-use env template (copy to your app root as `.env.local`)
- `Makefile` — convenience commands

## Quickstart (after unzipping fundraise-starter-plus into your repo)

1) **Place files**  
   Copy `docker-compose.yml`, `.env.local.docker`, and `Makefile` to the **root of your app repo** (same folder as `package.json`).

2) **Start services**  
```bash
make dc-up
# or: docker compose up -d
```

3) **Create app env**  
From your app repo root:
```bash
cp .env.local.docker .env.local     # overrides with docker settings
```

4) **Install deps & init DB**
```bash
make install
make db-push
make seed
```

5) **Run the app**
```bash
make dev
# open http://localhost:3000
# try http://localhost:3000/c/example-campaign
```

6) **Run tests**
```bash
make test   # unit + coverage (Vitest)
make e2e    # Playwright (ensure 'make dev' is running in another terminal)
```

7) **Shut down services**
```bash
make dc-down
```

## Notes
- The `DATABASE_URL` and `TYPESENSE_*` vars in `.env.local.docker` are already set to match the docker-compose services.
- For production/staging, do **not** use these dummy keys. Set real secrets in your cloud environment (AWS Secrets Manager / GitHub Actions / Amplify).

## Troubleshooting
- Postgres port already in use → change the host port in `docker-compose.yml` (e.g., `5433:5432`) and update `DATABASE_URL` accordingly.
- Typesense permission errors → ensure you kept the `TYPESENSE_API_KEY` consistent between compose and `.env.local`.
