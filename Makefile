SHELL := /bin/bash

# Docker Compose helpers
dc-up:
	docker compose up -d

dc-down:
	docker compose down

dc-logs:
	docker compose logs -f

# App helpers
install:
	pnpm install

db-push:
	pnpm prisma:push

seed:
	pnpm seed

dev:
	pnpm dev

test:
	pnpm test

e2e:
	pnpm e2e

build:
	pnpm build

start:
	pnpm start

ci-local: lint typecheck test build

lint:
	pnpm lint

typecheck:
	pnpm typecheck
