import assert from 'assert'
import { sequence } from './sequence'
import { partitionBy } from './partitionBy'

describe('partitionBy', () => {
  it('partition whenever the value changes', async () => {
    const ary = [2, 4, 6, 8, 3, 5, 7, 10, 8, 9]
    const result = await sequence(partitionBy(v => v % 2), ary)

    assert.deepStrictEqual(result, [[2, 4, 6, 8], [3, 5, 7], [10, 8], [9]])
  })
  it('should yield a single partition when the function is constant but upstream ends', async () => {
    const ary = [1, 2, 3, 4, 5]
    const result = await sequence(partitionBy(v => 1), ary)

    assert.deepStrictEqual(result, [ary])
  })
})
