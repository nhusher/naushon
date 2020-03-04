import assert from 'assert'
import { sequence } from './sequence'
import { drop } from './drop'

describe('drop', () => {
  it('should drop items from the head of an array', async () => {
    const input = [1, 2, 3, 4, 5]
    const output = await sequence<number>(drop(3), input)
    assert.deepEqual(output, [4, 5])
  })
  it('should drop characters from the head of a string', async () => {
    const input = "👻🌋🦀🔮"
    const output = await sequence(drop(3), input)

    assert.deepEqual(output, ["🔮"])
  })
})
