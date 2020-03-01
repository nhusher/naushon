// import assert from 'assert';
import stream from 'stream';
import { map } from "./map";
import assert from "assert";
import { eduction } from "./eduction";

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
})
