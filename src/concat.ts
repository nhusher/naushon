import { Step } from './types'
import { iterator, isSomeIterator } from "./iterator";

/**
 * Given an iterable that contains arrays, flatten the arrays into additional
 * output records.
 *
 * @param it
 */
export async function * concat<T> (it: Step<T | T[]>) {
  for await (let i of it) {
    if (isSomeIterator(i)) {
      for await (let j of iterator(i as T[])) {
        yield j
      }
    } else {
      yield i as T
    }
  }
}
