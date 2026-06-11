import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", ".claude/worktrees/**", "next-env.d.ts"],
  },
  ...nextVitals,
];

export default eslintConfig;
