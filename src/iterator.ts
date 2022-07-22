import { IterableLike } from "./types";

export function isIterator (val: any): val is Iterator<any> {
  try {
    const fn = val[Symbol.iterator]
    return Boolean(fn)
  } catch (e) {
    return false
  }
}

export function isAsyncIterator (val: any): val is AsyncIterator<any> {
  try {
    const fn = val[Symbol.asyncIterator]
    return Boolean(fn)
  } catch (e) {
    return false
  }
}

export function isSomeIterator (val: any): val is (AsyncIterator<any> | Iterator<any>) {
  return isIterator(val) || isAsyncIterator(val)
}

/**
 * For a given input, validate that the input is an iterable or iterable-like.
 * The result is then casted to an AsyncIterable because anything that obeys
 * the Iterable contract implicitly obeys the AsyncIterable contract, for the
 * purposes of this library.
 *
 * @param it
 */
export function iterator<T> (it: IterableLike<T>): AsyncGenerator<T, undefined, any> {
  if (isAsyncIterator(it)) {
    return it[Symbol.asyncIterator]()
  } else if (isIterator(it)) {
    return it[Symbol.iterator]()
  } else {
    throw new TypeError(`Iterator, AsyncIterator, or other iterable expected`)
  }
}

