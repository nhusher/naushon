import { close } from "./close"

/**
 * Returns a stateful transducer that will consume `n` items from the input
 * iterable before closing. It will attempt to gracefully terminate upstream
 * data streams before closing itself.
 *
 * @param n
 */
export function take<T>(n: number) {
  return async function * take (it: AsyncIterable<T>): AsyncIterable<T> {
    let c = n
    for await (let i of it) {
      c -= 1
      yield i
      if (c === 0) break
    }
    close(it)
  }
}
