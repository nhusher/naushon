const close = it => {
  if (it.return) it.return()
  if (it.destroy) it.destroy()
}

const iterator = it => {
  if (typeof it !== 'object') throw new TypeError(`Iterator expected`)
  if ('next' in it) return it
  else if (Symbol.iterator in it) return it[Symbol.iterator]()
  else if (Symbol.asyncIterator in it) return it[Symbol.asyncIterator]()
  throw new TypeError(`Iterator expected`)
}

const integers = function* integers(start = 0) {
  let i = start

  try {
    while (true) {
      yield i++
    }
  } finally {
    // ensure .return is called!
    // console.log('closed!', i)
  }
}

const cat = async function* cat(it) {
  for await (let i of it) {
    for await (let j of iterator(i)) {
      yield j
    }
  }
}

exports.map = fn => async function* map(it) {
  for await (let i of it) {
    yield fn(i)
  }
}

const mapCat = fn => compose(map(fn), cat)

const filter = fn => async function* filter(it) {
  for await (let i of it) {
    if (fn(i)) yield i
  }
}

exports.take = n => async function* take(it) {
  let m = n
  for await (let i of it) {
    m -= 1
    if (m === 0) close(it)

    yield i
  }
}

const takeWhile = fn => async function* takeWhile(it) {
  for await (let i of it) {
    if (!fn(i)) close(it)
    else yield i
  }
}

const drop = n => async function* drop(it) {
  for await (let i of it) {
    n = Math.max(0, n - 1)
    if (n === 0) yield i
  }
}

const dropWhile = fn => async function* dropWhile(it) {
  for await (let i of it) {
    if (!fn(i)) break
  }
  yield* it
}

const distinct = async function* distinct(it) {
  let seen = new Set()
  for await (let i of it) {
    if (!seen.has(i)) yield i
    seen.add(i)
  }
}

exports.interpose = s => async function* interpose(it) {
  let l

  for await (let i of it) {
    if (l) {
      yield l
      yield s
    }
    l = i
  }
  yield l
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

const first = it => iterator(it).next().then(({ value }) => value)

const find = (fn, coll) => compose(
  filter(fn),
  first
)(coll)

exports.compose = function compose(...fns) {
  return function (arg) {
    const [ first, ...rest ] = fns

    return rest.reduce((a, b) => b(a), first(arg))
  }
}

async function transduce(xform, reduce, init, coll) {
  let val = init
  for await (let i of xform(coll)) {
    val = await reduce(val, i)
  }
  return val
}

function eduction(xform, coll) {
  return xform(iterator(coll))
}

exports.sequence = async function sequence(xform, it) {
  let result = []
  for await (let i of eduction(xform, it)) {
    result.push(i)
  }
  return result
}


const inc = n => n + 1
const even = n => n % 2 === 0
const add = (a, b) => a + b

const delay = val => new Promise(resolve => setTimeout(() => resolve(val), 100))

// const xf = compose(
//     filter(even),
//     map(inc),
//     take(5)
// )
//
// async function run() {
//     console.log(await sequence(xf, integers())) // [1, 3, 5, 7, 9]
//     console.log(await find(v => v === 10000, integers())) // 7
//     console.log(await sequence(distinct, [1, 2, 1, 2, 3, 3, 4, 5, 6]))
//     console.log(await sequence(interpose(','), [2, 4 , 6]))
//     console.log(await sequence(compose(interpose(','), take(1)), [1]))
//     console.log(await transduce(distinct, add, 0, [1, 2, 1, 2, 3, 3, 4, 5, 6]))
//     console.log(await sequence(distinct, [1, 2, 3, 3, 4, 5, 4, 6]))
//     console.log(await eduction(distinct, [1, 2, 3, 4, 5]))
//     console.log(await sequence(take(5), [1, 2, 3]))
//     console.log(await sequence(compose(map(inc), takeWhile(v => v < 30)), integers()))
//     console.log(await sequence(dropWhile(v => v < 3), [1, 2, 3, 4, 5]))
//     console.log(await sequence(map(v => delay(v + 1)), [1, 2, 3]))
//     console.log(await sequence(cat, [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10]]))
//     console.log(await sequence(mapCat(v => [v]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
//     console.log(await sequence(partitionBy(Math.floor), [1, 1.1, 1.2, 1.3, 2, 2.2, 1]))
//     console.log(await sequence(partitionBy(Math.floor), []))
//     console.log(await sequence(partitionAll(3), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
// }
//
// run()
