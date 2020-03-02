import assert from 'assert'
import { sequence } from './sequence'
import { drop } from './drop'

describe('drop', () => {
  it('should drop items from the head', async () => {
    const input = [1, 2, 3, 4, 5]
    const output = await sequence<number, number>(drop<number>(3), input)
    assert.deepEqual(output, [4, 5])
  })
})
