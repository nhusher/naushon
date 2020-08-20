import { IterableLike, XForm } from "./types";
import { iterator } from "./iterator";

/**
 * For a given transducer and an iterable (async or otherwise), perform the
 * transduction on the iterable. Returns an async iterator of the result of
 * the eduction. Equivalent to `xform(iterator(it))`.
 *
 * @example
 * ```
 * let double = map(v => v * 2)
 *
 * let doubled = eduction(double, [1, 2, 3])
 * doubled.next().then(console.log) // 2
 * doubled.next().then(console.log) // 4
 * doubled.next().then(console.log) // 6
 * ```
 *
 * @param xform
 * @param it
 */
export function eduction<T, U> (xform: XForm<T, U>, it: IterableLike<T>) {
  return xform(iterator<T>(it))
}
