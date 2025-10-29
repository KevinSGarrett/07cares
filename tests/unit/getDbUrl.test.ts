import { describe, it, expect, beforeEach, vi } from "vitest";

// Helper to reset module cache between tests
async function importFresh() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const mod = await import("../../src/lib/getDbUrl.ts" as any);
	return mod as typeof import("../../src/lib/getDbUrl");
}

describe("getDbUrl", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		process.env.DATABASE_URL = "";
		process.env.AWS_REGION = "us-east-1";
	});

	it("returns env DATABASE_URL when set", async () => {
		process.env.DATABASE_URL = "postgresql://user:pass@host:5432/db";
		const { getDbUrl } = await importFresh();
		const url = await getDbUrl();
		expect(url).toBe(process.env.DATABASE_URL);
	});

	it("uses test secret when env is missing", async () => {
		process.env.DATABASE_URL = "";
		process.env.__TEST_SECRET_DB_URL = "postgresql://sec:ret@host:5432/db";
		const { getDbUrl } = await importFresh();
		const url = await getDbUrl();
		expect(url).toBe("postgresql://sec:ret@host:5432/db");
	});

	it("throws when neither env nor secret is available", async () => {
		process.env.DATABASE_URL = "";
		delete process.env.__TEST_SECRET_DB_URL;
		// Ensure AWS SDK path fails to avoid hitting real env/creds
		vi.doMock("@aws-sdk/client-secrets-manager", () => {
			class SecretsManagerClient { constructor(_: unknown) {} send() { return Promise.reject(new Error("not found")); } }
			class GetSecretValueCommand { constructor(_: unknown) {} }
			return { SecretsManagerClient, GetSecretValueCommand };
		});
		const { getDbUrl } = await importFresh();
		await expect(getDbUrl()).rejects.toThrow(/DATABASE_URL not available/);
	});
});


