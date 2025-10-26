// packages/core/src/errors/integration-error.ts

import { IntegrationErrorCode } from './error-codes.enum';

export class IntegrationError extends Error {
  public readonly name = 'IntegrationError';

  constructor(
    public readonly code: IntegrationErrorCode,
    public readonly message: string,
    public readonly details?: Record<string, unknown>,
    public readonly retryable: boolean = false,
    public readonly httpStatus?: number
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      retryable: this.retryable,
      httpStatus: this.httpStatus,
    };
  }

  static isIntegrationError(error: unknown): error is IntegrationError {
    return error instanceof IntegrationError;
  }
}
