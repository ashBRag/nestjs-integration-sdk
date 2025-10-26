// packages/core/src/types/integration.types.ts

export type IntegrationType = '';

export type TokenStatus = 'valid' | 'expired' | 'expiring_soon' | 'invalid';

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retryable?: boolean;
  idempotencyKey?: string;
}

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}
