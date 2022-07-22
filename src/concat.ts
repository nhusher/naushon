import { Step } from './types'
import { iterator, isSomeIterator } from "./iterator";
import { track } from "./Tracker";

/**
 * Given an iterable that yields iterables, flatten those iterables into additional
 * output records.
 *
 * @param it
 */
export const concat = track(async function * concat<T> (it: Step<T | T[]>) {
  for await (let i of it) {
    if (isSomeIterator(i)) {
      for await (let j of iterator(i as T[])) {
        yield j
      }
    } else {
      yield i as T
    }
  }
})
