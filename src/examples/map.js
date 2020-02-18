const { Readable } = require('stream')
const { createWriteStream } = require('fs')
const { parseFile } = require('fast-csv')
const { take, map, compose, sequence, interpose } = require('../tx')
const { memoryWatcher } =  require('../tx/memoryWatcher')

async function main() {
  let stopMemoryWatcher = memoryWatcher()

  // Returns a stream of rows from a 200mb CSV file:
  function getReadStream() {
    return parseFile('./data/statewide.csv', { headers: true })
  }

  // Convert a CSV row into an address string:
  const addressify = map(({ NUMBER, STREET, CITY }) => {
    return `${NUMBER} ${STREET}, ${CITY}`
  })

  // Define transformer pipeline:
  const transform = compose(
    addressify, // grab the address and format it
    interpose('\n')) // add newlines between every record

  // Pipe it to a file:
  const s = Readable
    .from(transform(getReadStream()))
    .pipe(createWriteStream('./data/output.txt'))

  // Could also read rows one at a time:
  // for await (const l of transform(getReadStream())) {
  //   if (l !== '\n') console.log(l)
  // }
  //
  // Could also cast to an array:
  // console.log(await sequence(transform, getReadStream()))

  // Stop the memory monitor:
  s.on('close', stopMemoryWatcher)
  /*
  Memory stats (mb):
    Heap Size	now:15	min:15	max:48	avg:46
    Heap Used	now:7	min:4	max:27	avg:15
   */
}

main()
