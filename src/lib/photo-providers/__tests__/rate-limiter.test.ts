import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TokenBucketRateLimiter } from '../rate-limiter'

describe('TokenBucketRateLimiter', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('allows requests when tokens available', () => {
    const limiter = new TokenBucketRateLimiter({ maxTokens: 5, refillRate: 1, windowMs: 1000 })
    expect(limiter.tryConsume()).toBe(true)
    expect(limiter.availableTokens()).toBe(4)
  })

  it('blocks when bucket empty', () => {
    const limiter = new TokenBucketRateLimiter({ maxTokens: 2, refillRate: 1, windowMs: 1000 })
    limiter.tryConsume()
    limiter.tryConsume()
    expect(limiter.tryConsume()).toBe(false)
  })

  it('refills tokens over time', () => {
    const limiter = new TokenBucketRateLimiter({ maxTokens: 10, refillRate: 10, windowMs: 1000 })
    // Drain all tokens
    for (let i = 0; i < 10; i++) limiter.tryConsume()
    expect(limiter.tryConsume()).toBe(false)

    // Advance 500ms — should refill 5 tokens (10/sec * 0.5s)
    vi.advanceTimersByTime(500)
    expect(limiter.availableTokens()).toBeGreaterThanOrEqual(4)
    expect(limiter.tryConsume()).toBe(true)
  })

  it('never exceeds maxTokens', () => {
    const limiter = new TokenBucketRateLimiter({ maxTokens: 5, refillRate: 100, windowMs: 1000 })
    vi.advanceTimersByTime(10000)
    expect(limiter.availableTokens()).toBe(5)
  })
})
