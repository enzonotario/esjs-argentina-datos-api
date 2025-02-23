import { describe, it } from 'vitest'
import { crawl } from '../src/actas/crawl'

describe(
  'actas',
  () => {
    it('crawl', async () => {
      const result = await crawl()

      expect(result).toMatchSnapshot()
    })
  },
  {
    timeout: 300000,
  },
)
