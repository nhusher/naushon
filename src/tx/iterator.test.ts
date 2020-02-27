import assert from 'assert';
import stream from 'stream';
import { iterator } from './iterator';

describe('iterator', () => {
  it('should work with arrays', async () => {
    let ary = [1, 2, 3]
    for await (let i of iterator([...ary])) {
      assert(i === ary.shift())
    }
  })
  it('should work with strings', async () => {
    let s = "👻👻👻👻"
    for await (let i of iterator(s)) {
      assert(i === "👻")
    }
  })
  it('should work with readable streams', async () => {
    let ary = [1, 2, 3]
    let s = stream.Readable.from([...ary])

    for await (let i of iterator(s)) {
      assert(i === ary.shift())
    }
  })
})
