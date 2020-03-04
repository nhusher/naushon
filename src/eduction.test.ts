import assert from 'assert'
import { eduction } from './eduction'
import { map } from './map'
import { isAsyncIterator } from './iterator'

describe('eduction', () => {
  it('should yield an async generator from an array', async () => {
    const it = eduction(map(v => v), [1, 2, 3, 4, 5])
    assert(isAsyncIterator(it))
    const output = []
    for await (let i of it) {
      output.push(i)
    }
    assert.deepEqual(output, [1, 2, 3, 4, 5])
  })
})
