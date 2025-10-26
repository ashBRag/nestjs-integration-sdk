// packages/core/src/config/default-configs.ts

import { IntegrationConfig } from './integration-config.interface';

export const DEFAULT_INTEGRATION_CONFIG: Partial<IntegrationConfig> = {
  tokenManagement: {
    bufferSeconds: 300,
  },
  http: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    retryBackoff: 2,
  },
  cache: {
    enabled: true,
  },
};

export const INTEGRATION_CONFIGS: Record<string, Partial<IntegrationConfig>> = {};
