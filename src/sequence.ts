import { eduction } from "./eduction";
import { IterableLike, XForm } from "./types";

/**
 * Given a transformer and an iterable, return a promise that will resolve to
 * an array of items from the iterable, passed through the transformer. This
 * will do bad things if the input iteratable is infinite or very large.
 *
 * @param xform
 * @param it
 */
export async function sequence<T, U> (xform: XForm<T, U>, it: IterableLike<T>): Promise<U[]> {
  let result = []
  for await (let i of eduction(xform, it)) {
    result.push(i)
  }
  return result
}
