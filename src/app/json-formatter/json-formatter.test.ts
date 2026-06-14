import { describe, it, expect } from 'vitest'

describe('JSON formatter logic', () => {
  it('formats valid JSON with indent', () => {
    const input = '{"name":"test","values":[1,2,3]}'
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, 2)
    expect(formatted).toContain('\n  "name"')
    expect(formatted).toContain('\n  "values"')
  })

  it('minifies JSON', () => {
    const input = '{  "a" : 1 }'
    const parsed = JSON.parse(input)
    const minified = JSON.stringify(parsed)
    expect(minified).toBe('{"a":1}')
  })

  it('throws on invalid JSON', () => {
    expect(() => JSON.parse('{invalid}')).toThrow()
  })
})
