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
    assert.deepStrictEqual(output, [1, 2, 3, 4, 5])
  })
  it('should throw a failed promise when the transform throws', async () => {
    const it = eduction(map(i => {
      if (i === 3) throw new Error(`An error`)
      return i
    }), [1, 2, 3])

    let loopRuns = 0
    await assert.rejects(async () => {
      for await (let _i of it) {
        loopRuns += 1
      }
    })
    assert.strictEqual(loopRuns, 2)
    const next = await it.next()
    assert(next.done)
    assert(next.value === undefined)
  })
})
