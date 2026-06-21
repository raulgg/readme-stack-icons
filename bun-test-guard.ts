const message =
  "This project uses Vitest, not Bun's test runner. Run `bun run test` instead of `bun test`.";

console.error(message);
process.exit(1);
