import assert from 'assert'
import { filter } from './filter'
import { sequence } from './sequence'

describe('filter', () => {
  it('should remove items from a list if the predicate returns false', async () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]
    const even = (v: number) => v % 2 === 0
    const output = await sequence(filter(even), input)
    assert.deepStrictEqual(output, input.filter(even))
  })
})
