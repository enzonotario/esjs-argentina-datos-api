import { describe, expect, it } from 'vitest'
import { crawl } from '../src/senadores/crawl'

describe(
  'actas',
  () => {
    it('crawl', async () => {
      const result = await crawl()

      console.log({result})

      expect(result).toMatchSnapshot()
    })
  },
  {
    timeout: 300000,
  },
)
