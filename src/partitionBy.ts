
export function partitionBy<T> (fn: (i: T) => any) {
  return async function* partitionBy(it: AsyncIterable<T>): AsyncIterable<T[]> {
    let p = null
    let k = Symbol()
    for await (let i of it) {
      if (fn(i) !== k) {
        if (p !== null) yield p
        p = [ i ]
        k = fn(i)
      } else {
        p!.push(i)
      }
    }
    if (p !== null) yield p
  }
}
