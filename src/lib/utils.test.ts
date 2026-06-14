import { describe, it, expect } from 'vitest'
import { cn, detectDialect } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
  })

  it('returns empty string for no args', () => {
    expect(cn()).toBe('')
  })
})

describe('detectDialect', () => {
  it('detects postgresql from SERIAL', () => {
    expect(detectDialect('CREATE TABLE users (id SERIAL)')).toBe('postgresql')
  })

  it('detects postgresql from :: cast', () => {
    expect(detectDialect("SELECT 'text'::VARCHAR")).toBe('postgresql')
  })

  it('detects sqlite from AUTOINCREMENT', () => {
    expect(detectDialect('CREATE TABLE users (id INTEGER AUTOINCREMENT)')).toBe('sqlite')
  })

  it('detects sqlite from PRAGMA', () => {
    expect(detectDialect('PRAGMA table_info(users)')).toBe('sqlite')
  })

  it('defaults to mysql', () => {
    expect(detectDialect('SELECT * FROM users')).toBe('mysql')
  })
})
