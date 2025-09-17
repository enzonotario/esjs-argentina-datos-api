/// <reference types="vitest" />
import type { TestSpecification } from 'vitest/node'
import { defineConfig } from 'vite'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const filesOrder = ['crawlDiputados.test.ts', 'crawlActas.test.ts']

class CustomSequencer {
  async sort(files: TestSpecification[]): Promise<TestSpecification[]> {
    return files.sort(([, filenameA], [, filenameB]) => {
      const pathnameA = filenameA.split('/').pop()
      const pathnameB = filenameB.split('/').pop()

      const indexA = filesOrder.indexOf(pathnameA)
      const indexB = filesOrder.indexOf(pathnameB)

      if (indexA > indexB) {
        return 1
      }
      if (indexA < indexB) {
        return -1
      }
      return 0
    })
  }

  public async shard(files: TestSpecification[]): Promise<TestSpecification[]> {
    return files
  }
}

export default defineConfig({
  test: {
    sequence: {
      sequencer: CustomSequencer,
    },
  },
})
