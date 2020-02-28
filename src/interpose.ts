

export function interpose <T, U> (s: U) {
  return async function * interpose(it: AsyncIterable<T>): AsyncIterable<T | U> {
    let l

    for await (let i of it) {
      if (l) {
        yield l
        yield s
      }
      l = i
    }
    if (l) yield l
  }
}
