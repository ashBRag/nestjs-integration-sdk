// packages/core/src/decorators/with-retry.decorator.ts

export function WithRetry(maxAttempts: number = 3, delay: number = 1000) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      let lastError: unknown;
      let currentDelay = delay;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          if (attempt < maxAttempts - 1) {
            await new Promise((resolve) => setTimeout(resolve, currentDelay));
            currentDelay *= 2;
          }
        }
      }

      throw lastError;
    };

    return descriptor;
  };
}
