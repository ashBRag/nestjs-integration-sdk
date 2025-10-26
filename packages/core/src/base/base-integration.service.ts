/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/core/src/base/base-integration.service.ts

import { IntegrationConfig, DEFAULT_INTEGRATION_CONFIG, INTEGRATION_CONFIGS } from '../config';
import { ITokenProvider } from '../interfaces';
import { IntegrationError } from '../errors';

export abstract class BaseIntegrationService {
  protected readonly config: IntegrationConfig;

  constructor(
    integrationName: string,
    protected readonly tokenProvider: ITokenProvider,
    userConfig?: Partial<IntegrationConfig>
  ) {
    this.config = {
      ...DEFAULT_INTEGRATION_CONFIG,
      ...INTEGRATION_CONFIGS[integrationName],
      ...userConfig,
      name: integrationName,
    } as IntegrationConfig;
  }

  protected async executeWithToken<T>(
    accountId: string,
    operation: (token: string) => Promise<T>
  ): Promise<T> {
    const token = await this.tokenProvider.getToken(accountId, this.config.name);

    try {
      return await operation(token);
    } catch (error) {
      if (this.isTokenExpiredError(error)) {
        const newToken = await this.tokenProvider.refreshToken(accountId, this.config.name);
        return await operation(newToken);
      }
      throw this.handleError(error);
    }
  }

  protected async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    const { retryAttempts = 3, retryDelay = 1000, retryBackoff = 2 } = this.config.http || {};

    let lastError: unknown;
    let attempt = 0;
    let delay = retryDelay;

    while (attempt < retryAttempts) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (!this.isRetryableError(error)) {
          throw error;
        }

        attempt++;
        if (attempt < retryAttempts) {
          await this.sleep(delay);
          delay *= retryBackoff;
        }
      }
    }

    throw lastError;
  }

  protected getBufferSeconds(): number {
    return this.config.tokenManagement.bufferSeconds;
  }

  protected isRetryableError(error: any): boolean {
    const status = error.response?.status;
    return (
      status >= 500 || status === 429 || error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET'
    );
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected abstract isTokenExpiredError(error: unknown): boolean;
  protected abstract handleError(error: unknown): IntegrationError;
}
