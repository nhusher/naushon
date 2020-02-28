import stream from 'stream';
import assert from "assert";
import {sequence} from "./sequence";
import {take} from "./take";

describe('take', () => {
  it('should pull the first three elements off of an array', async () => {
    const ary = [1, 2, 3, 4, 5]

    const output = await sequence(take(3), ary)
    assert.deepEqual(output, [1, 2, 3])
  })
  it('should pull the first three elements off of a stream', async () => {
    const s = stream.Readable.from([1, 2, 3, 4, 5])

    const output = await sequence(take(3), s)
    assert.deepEqual(output, [1, 2, 3])
    assert(s.destroyed)
  })
  it('should pull the first three elements off of a generator', async () => {
    function * gen() {
      for (let i = 1; i < 6; i += 1) {
        yield i
      }
    }
    const output = await sequence(take(3), gen())
    assert.deepEqual(output, [1, 2, 3])
  })
})
