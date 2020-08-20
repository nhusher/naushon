import stream from 'stream';
import assert from "assert";
import { eduction } from "./eduction";
import { sequence } from './sequence'
import { mapCat } from './mapCat'

describe('mapCat', () => {
  it('should behave like map in the common case', async () => {
    const ary = [ 2, 4, 6 ]
    const it = stream.Readable.from([ 1, 2, 3 ])
    const double = (v: number) => v * 2
    const xform = mapCat(double)

    for await (const i of eduction(xform, it)) {
      assert(i === ary.shift())
    }
  })
  it('if a mapper returns more than one array, it should collapse them', async () => {
    interface Character {
      name: string,
      friends: string[]
    }

    const ary = [{
      name: 'Phillip Fry',
      friends: [
        'Turanga Leela',
        'Bender'
      ]
    }, {
      name: 'Zapp Brannigan',
      friends: ['Kif Kroker']
    }, {
      name: 'Zoidberg',
      friends: []
    }] as Character[]

    const result1 = await sequence(mapCat((c: Character) => [c.name, ...c.friends]), ary)
    assert.deepStrictEqual(result1, [
      'Phillip Fry',
      'Turanga Leela',
      'Bender',
      'Zapp Brannigan',
      'Kif Kroker',
      'Zoidberg'
    ])

    const result2 = await sequence(mapCat((c: Character) => c.friends), ary)
    assert.deepStrictEqual(result2, [
      'Turanga Leela',
      'Bender',
      'Kif Kroker'
    ])
  })
})
