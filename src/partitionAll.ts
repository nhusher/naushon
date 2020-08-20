import { Step, XForm } from './types'

/**
 * Returns a stateful transducer that slices the input sequence into pieces
 * of n size. The last piece may be less than n items.
 *
 * @param n
 */
export function partitionAll<T> (n: number): XForm<T, T[]> {
  return async function * partitionBy (it: Step<T>) {
    let c = n
    let p: T[] = []
    for await (let i of it) {
      if (c === 0) {
        yield p
        c = n - 1
        p = [ i ]
      } else {
        c -= 1
        p.push(i)
      }
    }
    if (p.length) {
      yield p
    }
  }
}
