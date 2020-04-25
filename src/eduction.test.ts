import assert from 'assert'
import { eduction } from './eduction'
import { isAsyncIterator } from './iterator'
import { identity } from './identity'
import { map } from './map'

describe('eduction', () => {
  it('should yield an async generator from an array', async () => {
    const it = eduction(identity, [1, 2, 3, 4, 5])
    assert(isAsyncIterator(it))
    const output = []
    for await (let i of it) {
      output.push(i)
    }
    assert.deepEqual(output, [1, 2, 3, 4, 5])
  })
  it('should do something when it throws', async () => {
    const it = eduction(map(() => {
      throw new Error(`An error`)
    }), [1, 2, 3])

    try {
      for await (let i of it) {
        console.log(i)
      }
    } catch (e) {
      console.log(e)
    }
  })
})
