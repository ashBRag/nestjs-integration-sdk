// packages/core/src/config/config-merger.ts

import { IntegrationConfig } from "./integration-config.interface";
import {
  DEFAULT_INTEGRATION_CONFIG,
  INTEGRATION_CONFIGS,
} from "./default-configs";

export class ConfigMerger {
  static merge(
    integrationName: string,
    userConfig?: Partial<IntegrationConfig>,
  ): IntegrationConfig {
    return {
      ...DEFAULT_INTEGRATION_CONFIG,
      ...INTEGRATION_CONFIGS[integrationName],
      ...userConfig,
      name: integrationName,
    } as IntegrationConfig;
  }

  static getPredefined(
    integrationName: string,
  ): Partial<IntegrationConfig> | undefined {
    return INTEGRATION_CONFIGS[integrationName];
  }

  static hasPredefined(integrationName: string): boolean {
    return integrationName in INTEGRATION_CONFIGS;
  }
}
