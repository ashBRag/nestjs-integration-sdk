import { IntegrationConfig } from '../config/index';

export interface IIntegrationService {
  getConfig(): IntegrationConfig;
  isConnected(accountId: string): Promise<boolean>;
}
