/**
 * A stateful transducer that yields only unique values to the output stream
 *
 * @param it
 */
export async function * distinct<T> (it: AsyncIterable<T>): AsyncIterable<T> {
  let seen = new Set()
  for await (let i of it) {
    if (!seen.has(i)) yield i
    seen.add(i)
  }
}
