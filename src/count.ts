import { transduce } from './transduce'
import { IterableLike, XForm } from './types'

function inc (v: number) {
  return v + 1
}

/**
 * Counts the number of items in the resulting iterable without loading all
 * members into memory. It may still take some time to count very large
 * collections.
 *
 * @param xform
 * @param it
 */
export function count(xform: XForm<any, any>, it: IterableLike<any>): Promise<number> {
  return transduce(xform, inc, 0, it)
}
