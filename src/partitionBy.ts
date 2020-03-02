import { Step, XForm } from './types'

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
