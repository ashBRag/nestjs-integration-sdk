export interface IIntegrationService {
  isConnected(accountId: string): Promise<boolean>;
}
