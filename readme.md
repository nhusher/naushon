# naushon

A tool for incrementally transforming data in node and the browser using [AsyncIterators].

## Installation

```sh
$ npm install naushon
```

## Usage

```js
// Create a generator that produces an endless collection of arbitrarly-large
// integers. Arbitrary-sized integers can be larger than Integer.MAX_VALUE,
// with no upper-bound on their size. There is no way the set of all integers
// would fit in memory, so this is a good use case for naushon
function * integers () {
  let i = 0
  while (true) {
    yield i++
  }
}

const { eduction, filter, map, partitionAll, pipe, take } = require('naushon')

const xform = pipe(
  filter(n => n % 2 === 0),  // filter out odd numbers
  partitionAll(3),
  map(nums => nums.join(', ')),
  take(3))

for await (const block of eduction(xform, integers())) {
  console.log(block)
}
// Logs:
//  "2, 4, 6"
//  "8, 10, 12"
//  "14, 16, 18"
// then closes

const result = sequence(xform, integers())
// ["2, 4, 6", "8, 10, 12", "14, 16, 18"]
```

This is fine for truncating an infinitely-large theoretical data set, but what if we want to operate on a huge real data set?

```js
const { parseFile } = require('fast-csv')
const { eduction, distinct, filter, interpose, map, pipe, transduce } = require('naushon')

// A stream of rows from a huge list of addresses in a CSV file:
function addresses () {
  return parseFile('./statewide.csv', { headers: true })
}

// Create a filter transformer that yields only eligible addresses by checking
// that the addresses are in qualifying cities and states:
const eligibleAddress = filter(({ city, state }) => 
  eligibleStates.has(state) && eligibleCities.has(city))

// Convert the record into a string because we are going to write it to a file
const addressify = map(({ house_number_and_street, city, state, postcode }) =>
  `${house_number_and_street}, ${city}, ${state} ${postcode}`)

const xform = pipe(
  eligibleAddress, // filter out ineligible addresses
  addressify,      // convert data object into a string
  distinct,        // remove duplicate addresses
  interpose('\n')) // insert newlines between records

// Read each row from the CVS, transforming it with xform, and writing it to
// the output file:
Readable.from(eduction(xform, addresses())).pipe(createWriteStream('./out.txt'))

// Or: if we just want to know how many eligible addresses:

// Define a "reducer" that folds each entry into the result one at a time:
function reducer (acc, item) {
  // (The reducer is just like what you pass to [].reduce)
  if (item === '\n') {
    // we added '\n' but they aren't addresses in a previous step so we would
    // get nice-looking files, but they aren't addresses so don't count them
    return acc
  } 

  return acc + 1
}

// Consumes the address file a little bit at a time without consuming a ton
// of memory!
const count = await transduce(xform, reducer, 0, addresses())
```

## Rationale

Very often, a node program will need to read or write sets of data larger than the available memory size. [Node Streams][streams] do a good job of defining the source and destination primitives for node processes, but writing transformation streams is awkward and hard to compose. Streams also don't exist in the browser, where processing large sets of data will become more-and-more common as we expect more out of web applications.

Naushon attempts to address this need by using a fundamental language primitive, the AsyncIterator, to create composable pipelines. These pipelines can operate on in-memory data structures like arrays and strings, but also [database cursors], and audio, video, or filesystem stream objects.

The inspiration for the library is the Clojure [transducers] library, which is evident in the function names.

## Etymology

Naushon is an island off the coast of Massachusetts. The island is one side of Woods Hole, a place where the tide passes through at great speed when the ocean level is higher on one side than the other. The island links to other small islands with bridges, under which some of this water passes, and where it is held in tidal coves. This seems an appropriate metaphor for the intended use of the `naushon` library: given a massive flow, partition and transform it across many discrete steps.


[AsyncIterators]: https://2ality.com/2016/10/asynchronous-iteration.html
[streams]: https://nodejs.org/dist/latest-v12.x/docs/api/stream.html
[database cursors]: https://thecodebarbarian.com/cursors-in-mongoose-45.html
