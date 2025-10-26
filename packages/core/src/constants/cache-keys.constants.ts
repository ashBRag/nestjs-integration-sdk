// packages/core/src/constants/cache-keys.constants.ts

export const CACHE_KEY_PREFIX = {
  TOKEN: "token",
  INTEGRATION: "integration",
  RATE_LIMIT: "rate_limit",
} as const;

export const buildCacheKey = {
  token: (accountId: string, integration: string) =>
    `${CACHE_KEY_PREFIX.TOKEN}:${accountId}:${integration}`,
  rateLimit: (accountId: string, integration: string) =>
    `${CACHE_KEY_PREFIX.RATE_LIMIT}:${accountId}:${integration}`,
};
