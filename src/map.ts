import { Step, XForm } from './types'

/**
 * Returns a stateless transducer that performs a map from one data to
 * another. Similar to Array#map, but does not pass any additional
 * arguments aside from the item to be transformed.
 *
 * @param fn
 */
export function map<T, U> (fn: (t: T) => U): XForm<T, U> {
  return async function * map (it: Step<T>) {
    for await (let i of it) {
      yield fn(i)
    }
  }
}
