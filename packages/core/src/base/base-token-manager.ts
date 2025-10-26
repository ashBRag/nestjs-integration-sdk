/* eslint-disable @typescript-eslint/no-unused-vars */
// packages/core/src/base/base-token-manager.ts

import { ITokenProvider, ICacheProvider } from '../interfaces';
import { TokenDto } from '../dto';
import { IntegrationError, IntegrationErrorCode } from '../errors';

export abstract class BaseTokenManager implements ITokenProvider {
  constructor(
    protected readonly cache: ICacheProvider,
    protected readonly bufferSeconds: number = 300
  ) {}

  async getToken(accountId: string, integration: string): Promise<string> {
    const cacheKey = this.getCacheKey(accountId, integration);

    try {
      const cached = await this.cache.get<string>(cacheKey);
      if (cached) return cached;
    } catch (error) {
      // Cache failure - continue to DB
    }

    const tokenRecord = await this.getTokenFromDB(accountId, integration);
    if (!tokenRecord) {
      throw new IntegrationError(
        IntegrationErrorCode.OAUTH_NOT_CONFIGURED,
        `OAuth not configured for ${integration}`,
        { accountId, integration },
        false,
        401
      );
    }

    if (this.needsRefresh(tokenRecord.expiresAt)) {
      return this.refreshToken(accountId, integration);
    }

    const ttl = tokenRecord.expiresAt - Math.floor(Date.now() / 1000);
    try {
      await this.cache.set(cacheKey, tokenRecord.token, ttl);
    } catch (error) {
      // Cache failure is not critical
    }

    return tokenRecord.token;
  }

  async refreshToken(accountId: string, integration: string): Promise<string> {
    const tokenRecord = await this.getTokenFromDB(accountId, integration);
    if (!tokenRecord?.refreshToken) {
      throw new IntegrationError(
        IntegrationErrorCode.OAUTH_EXPIRED,
        'No refresh token available',
        { accountId, integration },
        false,
        401
      );
    }

    const newTokens = await this.refreshTokenViaAuthService(
      accountId,
      integration,
      tokenRecord.refreshToken
    );

    await this.updateTokenInDB(accountId, integration, {
      token: newTokens.accessToken,
      refreshToken: newTokens.refreshToken || tokenRecord.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + newTokens.expiresIn,
    });

    const cacheKey = this.getCacheKey(accountId, integration);
    try {
      await this.cache.set(cacheKey, newTokens.accessToken, newTokens.expiresIn);
    } catch (error) {
      // Cache failure is not critical
    }

    return newTokens.accessToken;
  }

  async hasToken(accountId: string, integration: string): Promise<boolean> {
    const token = await this.getTokenFromDB(accountId, integration);
    return !!token;
  }

  protected needsRefresh(expiresAt: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return expiresAt - now < this.bufferSeconds;
  }

  protected getCacheKey(accountId: string, integration: string): string {
    return `token:${accountId}:${integration}`;
  }

  protected abstract getTokenFromDB(
    accountId: string,
    integration: string
  ): Promise<TokenDto | null>;

  protected abstract updateTokenInDB(
    accountId: string,
    integration: string,
    data: Partial<TokenDto>
  ): Promise<void>;

  protected abstract refreshTokenViaAuthService(
    accountId: string,
    integration: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken?: string; expiresIn: number }>;
}
