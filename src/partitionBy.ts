import { Step, XForm } from './types'

/**
 * Returns a stateful transducer that returns a chunk of results any time the
 * provided function returns a different value.
 *
 * @param fn
 */
export function partitionBy<T> (fn: (i: T) => any): XForm<T, T[]> {
  return async function * partitionBy (it: Step<T>) {
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
