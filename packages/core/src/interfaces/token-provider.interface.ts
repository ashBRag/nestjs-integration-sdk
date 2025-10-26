export interface ITokenProvider {
  getToken(accountId: string, integration: string): Promise<string>;
  refreshToken(accountId: string, integration: string): Promise<string>;
  hasToken(accountId: string, integration: string): Promise<boolean>;
}
