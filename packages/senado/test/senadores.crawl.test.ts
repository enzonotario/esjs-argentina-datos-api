import { describe, expect, it } from 'vitest'
import { crawl } from '../src/senadores/crawl'
import { crawlJson } from '../src/senadores/crawlJson'

describe(
  'actas',
  () => {
    it('crawl', async () => {
      const result = await crawl()

      console.log({ result })

      expect(result).toMatchSnapshot()
    })

    it('crawlJson', async () => {
      const result = await crawlJson()

      expect(result).toMatchSnapshot()
    })
  },
  {
    timeout: 300000,
  },
)
