import { describe, it, expect } from 'vitest'
import { loginSchema } from '@/lib/schemas/login-schema'

describe('loginSchema', () => {
  it('validates correct email and password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('validates with rememberMe true', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rememberMe).toBe(true)
    }
  })

  it('validates with rememberMe false', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rememberMe).toBe(false)
    }
  })

  it('validates without rememberMe (optional)', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email'])
      expect(result.error.issues[0].message).toBe('Please enter a valid email address')
    }
  })

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email'])
    }
  })

  it('rejects password shorter than 8 characters', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['password'])
      expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
    }
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['password'])
    }
  })

  it('accepts exactly 8 character password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing email and password', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
    }
  })
})
