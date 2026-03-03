export interface RateLimiterConfig {
  maxTokens: number
  refillRate: number     // tokens per second
  windowMs: number
}

export class TokenBucketRateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly maxTokens: number
  private readonly refillRateMs: number  // tokens per millisecond

  constructor(config: RateLimiterConfig) {
    this.maxTokens = config.maxTokens
    this.tokens = config.maxTokens
    this.refillRateMs = config.refillRate / 1000
    this.lastRefill = Date.now()
  }

  tryConsume(): boolean {
    this.refill()
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true
    }
    return false
  }

  availableTokens(): number {
    this.refill()
    return Math.floor(this.tokens)
  }

  private refill(): void {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRateMs)
    this.lastRefill = now
  }
}

// Pre-configured limiters
export const unsplashLimiter = new TokenBucketRateLimiter({
  maxTokens: 45, refillRate: 45 / 3600, windowMs: 3_600_000,
})

export const pexelsLimiter = new TokenBucketRateLimiter({
  maxTokens: 180, refillRate: 180 / 3600, windowMs: 3_600_000,
})

export const googlePlacesLimiter = new TokenBucketRateLimiter({
  maxTokens: 16, refillRate: 16 / 60, windowMs: 60_000,
})
