import assert from 'assert'
import { concat } from './concat'
import { sequence } from "./sequence";

describe('concat', () => {
  it('should flatten nested arrays', async () => {
    const input: number[][] = [ [ 1, 2 ], [ 3 ], [ 4, 5, 6 ] ]
    const output = await sequence<number[], number>(concat, input)
    assert.deepEqual(output, [ 1, 2, 3, 4, 5, 6 ])
  })
})
