/**
 * Simple in-memory cache with TTL (Time To Live)
 * Used to cache expensive Stripe API calls for billing metrics
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Get a value from cache
   * @param key Cache key
   * @returns Cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set a value in cache with TTL
   * @param key Cache key
   * @param value Value to cache
   * @param ttlSeconds Time to live in seconds
   */
  set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data: value, expiresAt });
  }

  /**
   * Delete a value from cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Delete all keys matching a pattern
   * @param pattern String pattern to match (supports * wildcard)
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(
      "^" + pattern.replace(/\*/g, ".*") + "$"
    );
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}

// Singleton cache instance
export const cache = new InMemoryCache();

// Cache keys
export const CACHE_KEYS = {
  BILLING_METRICS: "billing:metrics",
  PLAN_DISTRIBUTION: "billing:plan-distribution",
  FAILED_PAYMENTS: "billing:failed-payments",
} as const;

// Cache TTL in seconds
export const CACHE_TTL = {
  BILLING_METRICS: 600, // 10 minutes
  PLAN_DISTRIBUTION: 600, // 10 minutes
  FAILED_PAYMENTS: 180, // 3 minutes
} as const;

/**
 * Invalidate all billing-related cache entries
 */
export function invalidateBillingCache(): void {
  cache.delete(CACHE_KEYS.BILLING_METRICS);
  cache.delete(CACHE_KEYS.PLAN_DISTRIBUTION);
}

/**
 * Invalidate failed payments cache
 */
export function invalidateFailedPaymentsCache(): void {
  cache.delete(CACHE_KEYS.FAILED_PAYMENTS);
}

/**
 * Invalidate all cache entries
 */
export function invalidateAllCache(): void {
  cache.clear();
}
