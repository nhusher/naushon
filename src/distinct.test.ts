import assert from 'assert'
import { sequence } from './sequence'
import {distinct, StepT} from './distinct'

describe('distinct', () => {
  it('should remove dupes', async () => {
    const input = [1, 2, 2, 3, 3, 4, 4, 5, 5]
    const output = await sequence<number>(distinct, input)
    assert.deepStrictEqual(output, [1, 2, 3, 4, 5])
  })
  it('should remove dupes', async () => {
    const ary = [1, 2, 2, 3, 3, 4, 4, 5, 5]


    const input = async function * () {
      for (const it of ary) {
        yield it
      }
    }
    const it = input() as StepT<number, true>
    it.getState = () => true;

    const output = await sequence<number>(distinct, it)
    assert.deepStrictEqual(output, [1, 2, 3, 4, 5])
  })
})
