import { close } from "./close"
import { Step, XForm } from './types'

/**
 * Returns a stateful transducer that will consume `n` items from the input
 * iterable before closing. It will attempt to gracefully terminate upstream
 * data streams before closing itself.
 *
 * @param n
 */
export function take<T> (n: number): XForm<T, T> {
  return async function * take (it: Step<T>) {
    let c = n
    for await (let i of it) {
      c -= 1
      yield i
      if (c === 0) break
    }
    close(it)
  }
}
