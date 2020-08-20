import { Step } from './types'

const MAX_WAITING_PUTS = 128;

export class Buf<T> implements AsyncIterable<T> {
  closed: boolean
  size: number
  items: T[]
  waitingTakes: ((it?: T) => void)[]
  waitingPuts: ((pushed?: boolean) => T)[]

  constructor (size: number) {
    if (size <= 0) throw new RangeError(`Buffer must have positive size`)
    if (size !== Math.floor(size)) throw new RangeError(`Buffer must have integer size`)

    this.closed = false
    this.size = size
    this.items = []
    this.waitingTakes = []
    this.waitingPuts = []
  }

  put (it: T): Promise<boolean> {
    if (this.closed) {
      return Promise.resolve(false)
    } else if (this.waitingTakes[0]) {
      this.waitingTakes.shift()!(it)
      return Promise.resolve(true)
    } else if (this.full) {
      if (this.waitingPuts.length > MAX_WAITING_PUTS)
        throw new RangeError(`Too many waiting puts`)

      return new Promise((resolve) => {
        this.waitingPuts.push((pushed = true) => {
          resolve(pushed);
          return it;
        })
      })
    } else {
      this.items.push(it)
      return Promise.resolve(true)
    }
  }

  take (): Promise<T | undefined> {
    if (this.closed) {
      return Promise.resolve(undefined)
    } else if (this.items.length) {
      return Promise.resolve(this.items.shift())
    } else if (this.waitingPuts.length) {
      return Promise.resolve(this.waitingPuts.shift()!())
    } else {
      return new Promise((resolve, _reject) => {
        this.waitingTakes.push((it?: T) => resolve(it))
      })
    }
  }

  close () {
    this.closed = true
    this.waitingPuts.forEach(put => put(false))
    this.waitingTakes.forEach(take => take(undefined))
  }

  get full (): boolean {
    return this.items.length >= this.size
  }

  [Symbol.asyncIterator]() {
    const self = this;
    return {
      async next(): Promise<IteratorResult<T, undefined>> {
        if (self.closed && self.items.length === 0) {
          return Promise.resolve({ value: undefined, done: true })
        } else {
          const value = await self.take()
          return { value, done: value === undefined } as IteratorResult<T, undefined>
        }
      }
    }
  }
}

/**
 * Given a max size and a "fill" function, return a stateful step function
 * that buffers incoming data. The step function should consume upstream data
 * eagerly up to the capacity of the buffer, after which it can do what it
 * wants.
 *
 * @param size
 * @param fill
 */
function buf<T> (size: number, fill: (buf: Buf<T>, it: Step<T>) => void) {
  return async function * buffer (it: Step<T>) {
    const buf = new Buf<T>(size)
    fill(buf, it)

    for await (let i of buf) {
      yield i
    }

    buf.close()
  }
}

//
// --- Halting buffer -------------------------------------------------------
//

async function haltingFill<T> (buf: Buf<T>, it: Step<T>) {
  for await (let i of it) {
    if (buf.closed) break
    await buf.put(i)
  }
  buf.close()
}

/**
 * Give a size, return a step function that will eagerly consume values from
 * upstream up to the given size. After that it will halt upstream
 * consumption until the downstream starts pulling entries from the buffer.
 *
 * @param size
 */
export function buffer<T> (size: number) {
  return buf<T>(size, haltingFill)
}

//
// --- Dropping buffer ------------------------------------------------------
//

async function droppingFill<T> (buf: Buf<T>, it: Step<T>) {
  for await (let i of it) {
    if (buf.closed) break
    if (buf.full) continue // ignore new
    await buf.put(i)
  }
  buf.close()
}

/**
 * Given a size, return a step function that will eagerly consume values from
 * the upstream until the given size. If the upstream has new values after
 * that, it will consume them but will not pass them to subsequent steps.
 *
 * @param size
 */
export function droppingBuffer<T> (size: number) {
  return buf<T>(size, droppingFill)
}

//
// --- Windowing buffer -----------------------------------------------------
//

async function windowingFill<T> (buf: Buf<T>, it: Step<T>) {
  for await (let i of it) {
    if (buf.closed) break
    if (buf.full) await buf.take() // drop the last
    await buf.put(i) // add new
  }
  buf.close()
}

/**
 * Given a size, return a step function that will eagerly consume values from
 * the upstream until the given size. If the upstream has new values after
 * that, it will consume them and drop the oldest/stalest record in the
 * buffer.
 *
 * @param size
 */
export function windowedBuffer<T> (size: number) {
  return buf<T>(size, windowingFill)
}
