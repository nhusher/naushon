
export function drop (n: number) {
  return async function * drop<T>(it: AsyncIterable<T>): AsyncIterable<T> {
    let c = n
    for await (let _i of it) {
      c = Math.max(0, c - 1)
      if (c === 0) break
    }
    yield* it
  }
}
