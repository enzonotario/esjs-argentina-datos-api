import { crawlActas } from './actas/crawlActas.ts'

export async function main() {
  await crawlActas()

  return 0
}
