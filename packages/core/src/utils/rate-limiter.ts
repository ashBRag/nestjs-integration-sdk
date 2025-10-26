// packages/core/src/utils/rate-limiter.util.ts

export interface RateLimiterOptions {
  requestsPerSecond?: number;
  requestsPerMinute?: number;
  requestsPerHour?: number;
}

export class RateLimiter {
  private requestTimestamps: number[] = [];

  constructor(private options: RateLimiterOptions) {}

  async acquire(): Promise<void> {
    const now = Date.now();
    this.cleanOldTimestamps(now);

    if (this.isLimitExceeded(now)) {
      const waitTime = this.calculateWaitTime(now);
      await this.sleep(waitTime);
      return this.acquire();
    }

    this.requestTimestamps.push(now);
  }

  private cleanOldTimestamps(now: number): void {
    const oneHourAgo = now - 3600000;
    this.requestTimestamps = this.requestTimestamps.filter((ts) => ts > oneHourAgo);
  }

  private isLimitExceeded(now: number): boolean {
    if (this.options.requestsPerSecond) {
      const oneSecondAgo = now - 1000;
      const recentRequests = this.requestTimestamps.filter((ts) => ts > oneSecondAgo);
      if (recentRequests.length >= this.options.requestsPerSecond) {
        return true;
      }
    }

    if (this.options.requestsPerMinute) {
      const oneMinuteAgo = now - 60000;
      const recentRequests = this.requestTimestamps.filter((ts) => ts > oneMinuteAgo);
      if (recentRequests.length >= this.options.requestsPerMinute) {
        return true;
      }
    }

    if (this.options.requestsPerHour) {
      const oneHourAgo = now - 3600000;
      const recentRequests = this.requestTimestamps.filter((ts) => ts > oneHourAgo);
      if (recentRequests.length >= this.options.requestsPerHour) {
        return true;
      }
    }

    return false;
  }

  private calculateWaitTime(now: number): number {
    if (this.options.requestsPerSecond) {
      const oneSecondAgo = now - 1000;
      const oldestInWindow = this.requestTimestamps.find((ts) => ts > oneSecondAgo);
      if (oldestInWindow) {
        return oldestInWindow + 1000 - now + 10;
      }
    }
    return 1000;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
