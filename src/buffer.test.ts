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
    let completedPuts = 0
    let i = 0

    async function producer () {
      await buf.put(++i)
      completedPuts += 1
      await buf.put(++i)
      completedPuts += 1
      await buf.put(++i)
      completedPuts += 1
      await buf.put(++i)
      completedPuts += 1
      await buf.put(++i)
      completedPuts += 1
      await buf.put(++i)
      completedPuts += 1
    }
    async function consumer () {
      assert.equal(await buf.take(), 1);
      assert.equal(await buf.take(), 2);
      assert.equal(await buf.take(), 3);

      // We can assert that the producer has halted by the number of
      // completed puts. It should equal the number of takes in the
      // consumer function.
      assert.equal(completedPuts, 3)
    }

    producer()
    await consumer()
  })
  it('closing the buffer yields false to puts', async () => {
    const buf = new Buf<number>(1)
    buf.put(1) // fill the buffer
    const preClosePut = buf.put(2)
    buf.close()
    assert.equal(await buf.put(1), false)
    assert.equal(await preClosePut, false)
  })
  it('closing the buffer yields undefined to takes', async () => {
    const buf = new Buf<number>(1)
    const preCloseTake = buf.take()
    buf.close()
    assert.equal(await buf.take(), undefined)
    assert.equal(await preCloseTake, undefined)
  })
})
