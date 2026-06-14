import { describe, it, expect } from 'vitest'

describe('Base64 encoding/decoding', () => {
  it('encodes text to base64', () => {
    const result = btoa('hello world')
    expect(result).toBe('aGVsbG8gd29ybGQ=')
  })

  it('decodes base64 to text', () => {
    const result = atob('aGVsbG8gd29ybGQ=')
    expect(result).toBe('hello world')
  })

  it('roundtrips correctly', () => {
    const original = 'DevTools Playground!'
    const encoded = btoa(original)
    const decoded = atob(encoded)
    expect(decoded).toBe(original)
  })
})
