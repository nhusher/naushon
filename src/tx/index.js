
class HaltingBuffer {
  constructor (size) {
    this._size = size
    this._items = []
    this._done = false

    this._waitingPut = null
    this._waitingTakes = []
  }
  async put (i) {
    if (this._waitingTakes.length) {
      this._waitingTakes.unshift()(i);
    } else if (this._items.length < this._size) {
      this._items.push(i)
    } else {
      this._items.push(i)
      return new Promise((resolve) => {
        this._waitingPut = resolve
      })
    }
  }
  take () {
    if (this._size.length === 0) {
      // todo: ensure waitingTakes never exceeds a reasonable amount
      return new Promise(resolve => {
        this._waitingTakes.push(resolve)
      })
    } else {
      // question: should this happen asynchronously?
      if (this._waitingPut) {
        this._waitingPut()
        this._waitingPut = null
      }
      return Promise.resolve({ done: this._done, value: this._items.shift() })
    }
  }
  close () {

  }
  _reconcile () {

  }
  [Symbol.asyncIterator]() {
    return {
      next: () => this.take(),
      return: () => this.close()
    }
  }
}


const buffer = s => function buffer(it) {
  const buffer = new HaltingBuffer(s)

  buffer.fill(it)

  return buffer
}


const partitionBy = fn => async function* partitionBy(it) {
  let p = null
  let k = Symbol()
  for await (let i of it) {
    if (fn(i) !== k) {
      if (p !== null) yield p
      p = [ i ]
      k = fn(i)
    } else {
      p.push(i)
    }
  }
  if (p !== null) yield p
}

const partitionAll = n => async function* partitionAll(it) {
  let c = n
  let p = []
  for await (let i of it) {
    if (c === 0) {
      yield p
      c = n - 1
      p = [ i ]
    } else {
      c -= 1
      p.push(i)
    }
  }
  if (p.length) {
    yield p
  }
}
