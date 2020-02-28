/**
 * A stateful transducer that drops records while the provided fn returns
 * true.
 *
 * @param fn
 */
export function dropWhile<T> (fn: (i: T) => boolean) {
  return async function * drop(it: AsyncIterable<T>): AsyncIterable<T> {
    for await (let i of it) {
      if (fn(i)) break
    }
    yield* it
  }
}
