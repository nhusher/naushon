export type IterableLike<T> =
  T[] |
  Iterable<T> |
  AsyncIterable<T>

export type XForm<T, U> = (it: AsyncIterable<T>) => AsyncIterable<U>
