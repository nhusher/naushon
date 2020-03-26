import { Step } from './types'

/**
 * Returns a stateless transducer that simply pipes input to output.
 *
 * @param it
 */
export async function * identity<T> (it: Step<T>) {
  for await (let i of it) {
    yield i
  }
}

