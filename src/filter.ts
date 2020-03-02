/**
 * Returns a stateless transducer that filters the input iterable using the
 * predicate fn, returning only items where the result of the predicate is
 * true.
 *
 * @param fn
 */
import { Step, XForm } from './types'

export function filter<T> (fn: (t: T) => boolean): XForm<T, T> {
  return async function * filter (it: Step<T>) {
    for await (let i of it) {
      if (fn(i)) yield i
    }
  }
}
