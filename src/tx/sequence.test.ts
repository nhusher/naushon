import stream from 'stream';
import assert from "assert";
import {sequence} from "./sequence";
import {map} from "./map";

describe('sequence', () => {
  const identity = map(v => v)

  it('should cast an array to an array', async () => {
    const output = await sequence(identity, [1, 2, 3])

    assert.deepEqual(output, [1, 2, 3])
  })

  it('should cast a simple stream to an array', async () => {
    const s = stream.Readable.from([1, 2, 3])
    const output = await sequence(identity, s)

    assert.deepEqual(output, [1, 2, 3])
  })

  it('should cast a generator to an array', async () => {
    function * gen() {
      for (let i = 1; i < 4; i += 1) {
        yield i
      }
    }

    const output = await sequence(identity, gen())
    assert.deepEqual(output, [1, 2, 3])
  })
})
