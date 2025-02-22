import { crawl } from './actas/crawl.ts'

export async function main() {
  await crawl()

  return 0
}
