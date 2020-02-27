import {IterableLike, XForm} from "./types";
import {eduction} from "./eduction";

type Reduce<T, U> = (a: T, b: U) => T

export async function transduce<T, U, V>(xform: XForm<T, U>, reduce: Reduce<V, U>, init: V, it: IterableLike<T>) {
  let val = init
  for await (let i of eduction(xform, it)) {
    val = await reduce(val, i)
  }
  return val
}
