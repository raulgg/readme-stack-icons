export type IconAssetPath = `assets/icons/${string}.svg`;
export type IconTheme = "light" | "dark";

export const ICON_CATEGORIES = [
  "Languages",
  "Frameworks",
  "Databases",
  "Cloud",
  "Tools",
] as const;

export type IconCategory = (typeof ICON_CATEGORIES)[number];

export type IconRegistryEntry = {
  label: string;
  category: IconCategory;
  light: IconAssetPath;
  dark?: IconAssetPath;
};

export const iconRegistry = {
  typescript: {
    label: "TypeScript",
    category: "Languages",
    light: "assets/icons/typescript.svg",
  },
  javascript: {
    label: "JavaScript",
    category: "Languages",
    light: "assets/icons/javascript.svg",
  },
  html5: {
    label: "HTML",
    category: "Languages",
    light: "assets/icons/html5.svg",
  },
  css: {
    label: "CSS",
    category: "Languages",
    light: "assets/icons/css.svg",
  },
  react: {
    label: "React",
    category: "Frameworks",
    light: "assets/icons/react.svg",
    dark: "assets/icons/react-dark.svg",
  },
  solidjs: {
    label: "SolidJS",
    category: "Frameworks",
    light: "assets/icons/solidjs.svg",
  },
  nextjs: {
    label: "Next.js",
    category: "Frameworks",
    light: "assets/icons/nextjs.svg",
  },
  astro: {
    label: "Astro",
    category: "Frameworks",
    light: "assets/icons/astro.svg",
    dark: "assets/icons/astro-dark.svg",
  },
  tailwindcss: {
    label: "Tailwind CSS",
    category: "Frameworks",
    light: "assets/icons/tailwindcss.svg",
  },
  arkui: {
    label: "Ark UI",
    category: "Frameworks",
    light: "assets/icons/arkui.svg",
  },
  materialui: {
    label: "Material UI",
    category: "Frameworks",
    light: "assets/icons/materialui.svg",
  },
  figma: {
    label: "Figma",
    category: "Tools",
    light: "assets/icons/figma.svg",
  },
  nodejs: {
    label: "Node.js",
    category: "Frameworks",
    light: "assets/icons/nodejs.svg",
  },
  bun: {
    label: "Bun",
    category: "Frameworks",
    light: "assets/icons/bun.svg",
  },
  vite: {
    label: "Vite",
    category: "Tools",
    light: "assets/icons/vite.svg",
  },
  pnpm: {
    label: "pnpm",
    category: "Tools",
    light: "assets/icons/pnpm.svg",
    dark: "assets/icons/pnpm-dark.svg",
  },
  npm: {
    label: "npm",
    category: "Tools",
    light: "assets/icons/npm.svg",
  },
  graphql: {
    label: "GraphQL",
    category: "Languages",
    light: "assets/icons/graphql.svg",
  },
  apollographql: {
    label: "Apollo GraphQL",
    category: "Frameworks",
    light: "assets/icons/apollographql.svg",
    dark: "assets/icons/apollographql-dark.svg",
  },
  hasura: {
    label: "Hasura",
    category: "Tools",
    light: "assets/icons/hasura.svg",
    dark: "assets/icons/hasura-dark.svg",
  },
  prisma: {
    label: "Prisma",
    category: "Databases",
    light: "assets/icons/prisma.svg",
    dark: "assets/icons/prisma-dark.svg",
  },
  postgresql: {
    label: "PostgreSQL",
    category: "Databases",
    light: "assets/icons/postgresql.svg",
  },
  neon: {
    label: "Neon",
    category: "Databases",
    light: "assets/icons/neon.svg",
  },
  redis: {
    label: "Redis",
    category: "Databases",
    light: "assets/icons/redis.svg",
  },
  mongodb: {
    label: "MongoDB",
    category: "Databases",
    light: "assets/icons/mongodb.svg",
    dark: "assets/icons/mongodb-dark.svg",
  },
  mysql: {
    label: "MySQL",
    category: "Databases",
    light: "assets/icons/mysql.svg",
    dark: "assets/icons/mysql-dark.svg",
  },
  vercel: {
    label: "Vercel",
    category: "Cloud",
    light: "assets/icons/vercel.svg",
    dark: "assets/icons/vercel-dark.svg",
  },
  cloudflare: {
    label: "Cloudflare",
    category: "Cloud",
    light: "assets/icons/cloudflare.svg",
  },
  amazonwebservices: {
    label: "AWS",
    category: "Cloud",
    light: "assets/icons/amazonwebservices.svg",
    dark: "assets/icons/amazonwebservices-dark.svg",
  },
  render: {
    label: "Render",
    category: "Cloud",
    light: "assets/icons/render.svg",
    dark: "assets/icons/render-dark.svg",
  },
  netlify: {
    label: "Netlify",
    category: "Cloud",
    light: "assets/icons/netlify.svg",
  },
  docker: {
    label: "Docker",
    category: "Tools",
    light: "assets/icons/docker.svg",
  },
  resend: {
    label: "Resend",
    category: "Cloud",
    light: "assets/icons/resend.svg",
    dark: "assets/icons/resend-dark.svg",
  },
  inngest: {
    label: "Inngest",
    category: "Cloud",
    light: "assets/icons/inngest.svg",
    dark: "assets/icons/inngest-dark.svg",
  },
  n8n: {
    label: "n8n",
    category: "Tools",
    light: "assets/icons/n8n.svg",
  },
  sentry: {
    label: "Sentry",
    category: "Cloud",
    light: "assets/icons/sentry.svg",
  },
  posthog: {
    label: "PostHog",
    category: "Cloud",
    light: "assets/icons/posthog.svg",
  },
  git: {
    label: "Git",
    category: "Tools",
    light: "assets/icons/git.svg",
  },
  github: {
    label: "GitHub",
    category: "Tools",
    light: "assets/icons/github.svg",
    dark: "assets/icons/github-dark.svg",
  },
  githubactions: {
    label: "GitHub Actions",
    category: "Tools",
    light: "assets/icons/githubactions.svg",
  },
  vitest: {
    label: "Vitest",
    category: "Tools",
    light: "assets/icons/vitest.svg",
  },
  playwright: {
    label: "Playwright",
    category: "Tools",
    light: "assets/icons/playwright.svg",
  },
  linear: {
    label: "Linear",
    category: "Tools",
    light: "assets/icons/linear.svg",
  },
  vim: {
    label: "Vim",
    category: "Tools",
    light: "assets/icons/vim.svg",
  },
  cursor: {
    label: "Cursor",
    category: "Tools",
    light: "assets/icons/cursor.svg",
    dark: "assets/icons/cursor-dark.svg",
  },
  opencode: {
    label: "OpenCode",
    category: "Tools",
    light: "assets/icons/opencode.svg",
    dark: "assets/icons/opencode-dark.svg",
  },
  codex: {
    label: "Codex",
    category: "Tools",
    light: "assets/icons/codex.svg",
    dark: "assets/icons/codex-dark.svg",
  },
  claude: {
    label: "Claude",
    category: "Tools",
    light: "assets/icons/claude.svg",
  },
  openclaw: {
    label: "OpenClaw",
    category: "Tools",
    light: "assets/icons/openclaw.svg",
  },
} as const satisfies Record<string, IconRegistryEntry>;

export type IconSlug = keyof typeof iconRegistry;
export type RegisteredIcon = IconRegistryEntry & { slug: IconSlug };

export function getIconBySlug(slug: string): RegisteredIcon | undefined {
  if (!isIconSlug(slug)) {
    return undefined;
  }

  return {
    slug,
    ...iconRegistry[slug],
  };
}

export function getIconLabel(slug: string): string | undefined {
  return getIconBySlug(slug)?.label;
}

export function getIconAssetPath({
  slug,
  theme,
}: {
  slug: IconSlug;
  theme: IconTheme;
}): IconAssetPath {
  const icon: IconRegistryEntry = iconRegistry[slug];
  return theme === "dark" ? (icon.dark ?? icon.light) : icon.light;
}

export function listRegisteredIcons(): readonly RegisteredIcon[] {
  return Object.entries(iconRegistry).map(([slug, icon]) => ({
    ...(icon as IconRegistryEntry),
    slug: slug as IconSlug,
  }));
}

export function listIconSlugs(): readonly IconSlug[] {
  return Object.keys(iconRegistry) as IconSlug[];
}

export function listIconCategories(): readonly IconCategory[] {
  return ICON_CATEGORIES;
}

export function isIconSlug(slug: string): slug is IconSlug {
  return Object.hasOwn(iconRegistry, slug);
}
