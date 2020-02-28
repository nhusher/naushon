import {pipe} from "./pipe";
import {map} from "./map";
import {cat} from "./cat";

/**
 * Combination of map and cat transducers. Given a function, apply that
 * function to every input element, yielding an output element. If the output
 * of the map function is an array, it will be flattened into additional
 * output records.
 *
 * @param fn
 */
export function mapCat<T, U>(fn: (i: T) => U) {
  return pipe(map(fn), cat)
}
