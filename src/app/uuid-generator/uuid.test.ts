import { describe, it, expect } from 'vitest'
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid'

describe('UUID generation', () => {
  it('generates a valid v4 UUID', () => {
    const id = uuidv4()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('generates a valid v7 UUID', () => {
    const id = uuidv7()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/)
  })

  it('generates unique UUIDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uuidv4()))
    expect(ids.size).toBe(100)
  })
})
