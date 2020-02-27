import { iterator } from "./iterator";

export async function * cat<T> (it: AsyncIterable<T[]>): AsyncIterable<T> {
  for await (let i of it) {
    for await (let j of iterator(i)) {
      yield j
    }
  }
}
