import { describe, expect, it } from 'vitest'
import { main } from '../src/main'

describe('senado', () => {
  it('should run a test', async () => {
    const result = await main()

    expect(result).toBe(0)
  })
}, {
  timeout: 300000,
})
