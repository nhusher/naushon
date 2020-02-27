import {pipe} from "./pipe";
import {map} from "./map";
import {cat} from "./cat";

export function mapCat<T, U>(fn: (i: T) => U) {
  return pipe(map(fn), cat)
}
