import {close} from "./close";

/**
 * Returns a stateless transducer that filters the input iterable using the
 * predicate fn, returning only items where the result of the predicate is
 * true.
 *
 * @param fn
 */
export function takeWhile<T>(fn: (t: T) => boolean) {
  return async function * filter (it: AsyncIterable<T>): AsyncIterable<T> {
    for await (let i of it) {
      if (!fn(i)) break
      yield i
    }
    close(it)
  }
}
