import { Step, XForm } from './types'

/**
 * A stateful transducer that drops records while the provided fn returns
 * true.
 *
 * @param fn
 */
export function dropWhile<T> (fn: (i: T) => boolean): XForm<T, T> {
  return async function * drop (it: Step<T>) {
    while (true) {
      let { done, value } = await it.next()
      if (done) break

      if (!fn(value as T)) {
        yield value as T
        break;
      }
    }

    yield * it
  }
}
