import assert from 'assert'
import { Buf } from './buffer'

describe('Buf', () => {
  it('should take an item and return an item', async () => {
    const buf = new Buf<number>(1)

    assert(await buf.put(3))
    assert(buf.full)
    assert.equal(await buf.take(), 3)
  })
  it('should halt puts if the buffer fills up', async () => {
    const buf = new Buf<number>(1)
    // TODO
  })
})
