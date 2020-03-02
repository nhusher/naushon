/**
 * Retuerns a transducer that, given a value, inserts that value between
 * every item in the output stream.
 *
 * @param s
 */
import { Step, XForm } from './types'

export function interpose<T, U> (s: U): XForm<T, T | U> {
  return async function * interpose (it: Step<T>) {
    let l

    for await (let i of it) {
      if (l) {
        yield l
        yield s
      }
      l = i
    }
    if (l) yield l
  }
}
