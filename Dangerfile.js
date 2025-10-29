// Simple Danger checks for PR hygiene
const title = danger.github.pr.title || "";
if (!/^(feat|fix|docs|chore|refactor|perf|test|ci|build|style)(\(.+\))?:\s.+/i.test(title)) {
  warn("PR title should follow Conventional Commits (e.g., feat: add wizard)");
}

const body = (danger.github.pr.body || "").trim();
if (body.length < 20) {
  warn("Please add a detailed PR description (Summary, What & Why, Screenshots, Tests, Checklist)");
}

const modifiedFiles = [...danger.git.modified_files, ...danger.git.created_files];
const touchesSrc = modifiedFiles.some((f) => f.startsWith("src/"));
if (touchesSrc) {
  const hasTests = modifiedFiles.some((f) => f.startsWith("tests/") || f.startsWith("e2e/"));
  const hasDocs = modifiedFiles.some((f) => f.startsWith("docs/"));
  if (!hasTests && !hasDocs) {
    warn("Changes in src/ should include tests and/or docs.");
  }
}


