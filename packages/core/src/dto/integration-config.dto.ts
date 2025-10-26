// packages/core/src/dto/integration-config.dto.ts

export class IntegrationConfigDto {
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
}
