import assert from 'assert'
import { cat } from './cat'
import {sequence} from "./sequence";

describe('cat', () => {
  it('should flatten nested arrays', async () => {
    const input: number[][] = [[1, 2], [3], [4, 5, 6]]
    const output = await sequence<number[], number>(cat, input)
    assert.deepEqual(output, [1,2,3,4,5,6])
  })
})
