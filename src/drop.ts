/**
 * Given a number, return a stateful transducer that will close after yielding
 * the specified number of records.
 *
 * @param n
 */
import { Step, XForm } from './types'

export function drop<T> (n: number): XForm<T, T> {
  return async function * drop (it: Step<T>) {
    for (let i = n; i; i -= 1) {
      const { done } = await it.next()
      if (done) break;
    }
    yield * it
  }
}
