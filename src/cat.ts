import { iterator, isIterator } from "./iterator";

export async function * cat<T> (it: AsyncIterable<T | T[]>): AsyncIterable<T> {
  for await (let i of it) {
    if (isIterator(i)) {
      for await (let j of iterator(i as T[])) {
        yield j
      }
    } else {
      yield i as T
    }
  }
}
