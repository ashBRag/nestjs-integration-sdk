// packages/core/src/utils/retry.util.ts

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: unknown) => boolean;
}

export class RetryUtil {
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      backoffMultiplier = 2,
      shouldRetry = () => true,
    } = options;

    let lastError: unknown;
    let delay = initialDelay;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts - 1 || !shouldRetry(error)) {
          throw error;
        }

        await this.sleep(Math.min(delay, maxDelay));
        delay *= backoffMultiplier;
      }
    }

    throw lastError;
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
