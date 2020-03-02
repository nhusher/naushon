// import assert from 'assert';
import stream from 'stream';
import { map } from "./map";
import assert from "assert";
import { eduction } from "./eduction";
import { sequence } from './sequence'

describe('map', () => {
  it('should map from number to number space', async () => {
    const ary = [ 2, 4, 6 ]
    const it = stream.Readable.from([ 1, 2, 3 ])
    const double = (v: number) => v * 2
    const xform = map(double)

    for await (const i of eduction(xform, it)) {
      assert(i === ary.shift())
    }
  })
  it('should map from object to string space', async () => {
    const ary = [ {
      name: 'Phillip Fry'
    }, {
      name: 'Turanga Leela'
    } ]
    const it = stream.Readable.from([ ...ary ])

    const name = (v: { name: string }) => v.name
    const xform = map(name)

    for await (const i of eduction(xform, it)) {
      assert(i === ary.shift()!.name)
    }
  })
  it('should map over some numbers', async () => {
    const cardinals: string[] = ['zero', 'one', 'two', 'three']
    function cardinalify (n: number) {
      return cardinals[n]
    }

    const input = [1, 3, 2, 1, 0]
    const output = await sequence<number, string>(map(cardinalify), input)

    assert.deepEqual(output, ['one', 'three', 'two', 'one', 'zero'])
  })
})
