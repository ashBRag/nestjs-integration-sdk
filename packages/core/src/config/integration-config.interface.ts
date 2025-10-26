// packages/core/src/config/integration-config.interface.ts

export interface IntegrationConfig {
  name: string;
  displayName?: string;
  tokenManagement: {
    bufferSeconds: number;
  };
  http?: {
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
    retryBackoff?: number;
  };
  rateLimits?: {
    requestsPerSecond?: number;
    requestsPerMinute?: number;
    requestsPerHour?: number;
  };
  cache?: {
    enabled?: boolean;
    ttl?: number;
  };
}
