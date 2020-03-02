import { close } from "./close";
import { Step, XForm } from './types'

/**
 * Returns a stateless transducer that filters the input iterable using the
 * predicate fn, returning only items where the result of the predicate is
 * true.
 *
 * @param fn
 */
export function takeWhile<T> (fn: (t: T) => boolean): XForm<T, T> {
  return async function * filter (it: Step<T>) {
    for await (let i of it) {
      if (!fn(i)) break
      yield i
    }
    close(it)
  }
}
