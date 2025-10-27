// DangerJS rules
// Requires DANGER_GITHUB_API_TOKEN in CI

const fs = require('fs');

// PR size warning
const additions = danger.github.pr.additions || 0;
if (additions > 1500) {
  warn(`Large PR with **${additions}** additions — consider splitting.`);
}

// Require tests for src/app or src/lib changes
const changedFiles = danger.git.modified_files.concat(danger.git.created_files);
const touchesCode = changedFiles.some(f => f.startsWith('src/app') || f.startsWith('src/lib') || f.startsWith('src/server'));
const touchesTests = changedFiles.some(f => f.includes('test') || f.includes('__tests__') || f.startsWith('tests/'));
if (touchesCode && !touchesTests) {
  warn("No tests were added/updated while code changed.");
}

// Coverage summary check (if present)
try {
  const summary = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
  const st = summary.total.statements.pct;
  if (st < 80) {
    fail(`Coverage gate failed: statements ${st}% < 80%`);
  } else {
    message(`Coverage OK: statements ${st}%`);
  }
} catch (e) {
  warn("No coverage summary found. Ensure tests produce coverage.");
}
