import {Step, XForm} from "./types";

export class Tracker<T, U> implements Step<U> {
  private gen?: AsyncGenerator<U, void, any>
  xform: XForm<T, U>
  up: Step<T>
  last: U | undefined

  constructor (xform: XForm<T, U>, up: Step<T> | Tracker<unknown, T>) {
    this.xform = xform
    this.up = up
   }

  get generator() {
    if (!this.gen) this.gen = this.xform(this.up)
    return this.gen
  }

  get state(): unknown[] {
    if (isTrackableStep(this.up)) {
      return [...this.up.state, this.last]
    } else {
      return [this.last]
    }
  }

  async next() {
    try {
      const next = await this.generator.next()
      this.last = next.done ? undefined : next.value
      return next
    } catch (e) {
      // todo: handle error case?
      throw e
    }
  }

  return (val: void | PromiseLike<void>) {
    return this.generator.return(val)
  }

  throw (e: unknown) {
    return this.generator.throw(e)
  }

  [Symbol.asyncIterator]() { return this }
}

export type XFormT<T, U> = (it: Tracker<unknown, T> | Step<T>) => Tracker<T, U>

export function isTrackableStep(step: Step<unknown> | Tracker<unknown, unknown>): step is Tracker<unknown, unknown> {
  return step instanceof Tracker
}



export function track<T, U> (xform: XForm<T, U>): XFormT<T, U> {
  return function tracked (up: Step<T>) {
    // TODO: figure out some way to get a value-stable name without generating a new class instance for every evaluation
    //       of this function. Perhaps a weakmap with an optional key? That seems like the smart play.
    return new Tracker<T, U>(xform, up)
  }
}
