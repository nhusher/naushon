import assert from 'assert'
import stream from 'stream'
import {sequence} from "./sequence";
import {takeWhile} from "./takeWhile";

describe('takeWhile', () => {
  it('should take everything if the predicate is always true', async () => {
    const input = [1, 2, 3]
    const output = await sequence(takeWhile(_v => true), input)
    assert.deepEqual(input, output)
  })
  it('should terminate the stream if the predicate immediately returns false', async () => {
    const input = stream.Readable.from([1, 2, 3])
    const output = await sequence(takeWhile(_v => false), input)
    assert.deepEqual(output, [])
    assert(input.destroyed)
  })
  it('should terminate in the middle if the predicate returns false', async () => {
    const input = stream.Readable.from(["Phillip Fry", "Turanga Leela", null, "Hermes Conrad"])
    const output = await sequence(takeWhile(v => v !== null), input)
    assert.deepEqual(output, ["Phillip Fry", "Turanga Leela"])
    assert(input.destroyed)
  })
})
