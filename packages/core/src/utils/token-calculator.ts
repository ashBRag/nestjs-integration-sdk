// packages/core/src/utils/token-calculator.util.ts

export class TokenCalculator {
  static isExpired(expiresAt: number): boolean {
    return expiresAt <= Math.floor(Date.now() / 1000);
  }

  static needsRefresh(expiresAt: number, bufferSeconds: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return expiresAt - now < bufferSeconds;
  }

  static calculateTTL(expiresAt: number, bufferSeconds: number = 0): number {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, expiresAt - now - bufferSeconds);
  }

  static calculateExpiresAt(expiresIn: number): number {
    return Math.floor(Date.now() / 1000) + expiresIn;
  }
}
