import assert from 'assert'
import { concat } from './concat'
import { sequence } from "./sequence";

describe('concat', () => {
  it('should flatten nested arrays', async () => {
    const input: number[][] = [ [ 1, 2 ], [ 3 ], [ 4, 5, 6 ] ]
    const output = await sequence<number[], number>(concat, input)
    assert.deepEqual(output, [ 1, 2, 3, 4, 5, 6 ])
  })

  it('should allow nested items to be iterables', async () => {
    function * range (start: number, end: number) {
      for (let i = start; i < end + 1; i += 1) {
        yield i
      }
    }

    const input: Generator<number>[] = [range(1, 5), range(6, 10), range(11, 15)]
    const output = await sequence(concat, input)
    assert.deepEqual(output, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  })

  it('should allow nested items to be async iterables', async () => {
    function wait (ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    async function * range (start: number, end: number) {
      for (let i = start; i < end + 1; i += 1) {
        await wait(0)
        yield i
      }
    }

    const input: AsyncGenerator<number>[] = [range(1, 5), range(6, 10), range(11, 15)]
    const output = await sequence(concat, input)
    assert.deepEqual(output, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  })
})
