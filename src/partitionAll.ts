export function partitionAll<T> (n: number) {
  return async function * partitionBy (it: AsyncIterable<T>): AsyncIterable<T[]> {
    let c = n
    let p: T[] = []
    for await (let i of it) {
      if (c === 0) {
        yield p
        c = n - 1
        p = [ i ]
      } else {
        c -= 1
        p.push(i)
      }
    }
    if (p.length) {
      yield p
    }
  }
}
