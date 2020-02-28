import {IterableLike, XForm} from "./types";
import {eduction} from "./eduction";

type Reduce<T, U> = (a: T, b: U) => T

/**
 * Given a transformer, a reduce function, an initial state, and an
 * AsyncIterable (or similar), consume the iterable into the reducer until
 * the iterable terminates. Don't use this on infinite iterators or you will
 * have a bad time.
 *
 * @param xform
 * @param reduce
 * @param init
 * @param it
 */
export async function transduce<T, U, V>(xform: XForm<T, U>, reduce: Reduce<V, U>, init: V, it: IterableLike<T>) {
  let val = init
  for await (let i of eduction(xform, it)) {
    val = await reduce(val, i)
  }
  return val
}
