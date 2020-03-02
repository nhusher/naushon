export type IterableLike<T> =
  T[] |
  Iterable<T> |
  AsyncIterable<T> |
  Iterator<T> |
  AsyncIterator<T> |
  Generator<T> |
  AsyncGenerator<T>

export type Step<T> = AsyncGenerator<T, void, any>

export type XForm<T, U> = (it: Step<T>) => Step<U>
