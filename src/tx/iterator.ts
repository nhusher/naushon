import {IterableLike} from "./types";

export function isIterator (val: any): val is (Iterator<any> | AsyncIterator<any>) {
  try {
    const fn = val[Symbol.asyncIterator] || val[Symbol.iterator]
    return Boolean(fn)
  } catch (e) {
    return false
  }
}

/**
 * For a given input, validate that the input is an iterable or iterable-like.
 * The result is then casted to an AsyncIterable because anything that obeys
 * the Iterable contract implicitly obeys the AsyncIterable contract, for the
 * purposes of this library.
 *
 * @param it
 */
export function iterator<T>(it: IterableLike<T>): AsyncIterable<T> {
  if (isIterator(it)) {
    // the thing is already an iterator
    // trust that it conforms to asynciterator even if it's just a regular iterator
    return it as unknown as AsyncIterable<T>
  } else {
    throw new TypeError(`Iterator, AsyncIterator, or other iterable expected`)
  }
}
