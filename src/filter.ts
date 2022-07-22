/**
 * Returns a stateless transducer that filters the input iterable using the
 * predicate fn, returning only items where the result of the predicate is
 * true.
 *
 * @param fn
 */
import { track, XFormT } from "./Tracker";
import { Step } from './types'

export function filter<T> (fn: (t: T) => boolean): XFormT<T, T> {
  return track(async function * filter (it: Step<T>) {
    for await (let i of it) {
      if (fn(i)) yield i
    }
  })
}
