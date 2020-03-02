import assert from 'assert'
import { sequence } from './sequence'
import { dropWhile } from './dropWhile'

describe('dropWhile', () => {
  it('should drop items from the head', async () => {
    const input = [1, 2, 3, 4, 5]
    const output = await sequence(dropWhile(v => v < 4), input)
    assert.deepEqual(output, [4, 5])
  })
})
