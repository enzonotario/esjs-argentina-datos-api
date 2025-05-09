import { it } from 'vitest'
import { compileActasIndex } from '../src/data/compileActasIndex'

it('should compile actas index for all years', async () => {
  await compileActasIndex()
})
