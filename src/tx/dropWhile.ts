
export function drop<T> (fn: (i: T) => boolean) {
  return async function * drop(it: AsyncIterable<T>): AsyncIterable<T> {
    for await (let i of it) {
      if (fn(i)) break
    }
    yield* it
  }
}
