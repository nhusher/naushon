import assert from 'assert';
import { partitionAll } from './partitionAll'
import { sequence } from './sequence'

describe('partitionAll', () => {
  it('should split an array into chunks, the last chunk may be smaller', async () => {
    const ary = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = await sequence(partitionAll(3), ary)
    assert.deepStrictEqual(result, [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
  })
  it('should yield a single chunk if it is lager than the input collection', async () => {
    const ary = [1, 2, 3, 4, 5]
    const result = await sequence(partitionAll(10), ary)
    assert.deepStrictEqual(result, [[1, 2, 3, 4, 5]])
  })
})
