function mb(num) {
  return Math.round(num / 1024 / 1024)
}

exports.memoryWatcher = function memoryWatcher(logInterval, probeInterval = 100) {
  let probes = 0
  let currentHeapTotal
  let minHeapTotal
  let maxHeapTotal
  let averageHeapTotal
  let currentHeapUsed
  let minHeapUsed
  let maxHeapUsed
  let averageHeapUsed

  const probe = setInterval(() => {
    const { heapUsed, heapTotal } = process.memoryUsage()

    if (probes === 0) {
      currentHeapTotal = heapTotal
      minHeapTotal = heapTotal
      maxHeapTotal = heapTotal
      averageHeapTotal = heapTotal
      currentHeapUsed = heapUsed
      minHeapUsed = heapUsed
      maxHeapUsed = heapUsed
      averageHeapUsed = heapUsed
      probes = 1
    } else {
      minHeapTotal = Math.min(heapTotal, minHeapTotal)
      maxHeapTotal = Math.max(heapTotal, maxHeapTotal)
      averageHeapTotal = (averageHeapTotal * probes + heapTotal) / (probes + 1)

      minHeapUsed = Math.min(heapUsed, minHeapUsed)
      maxHeapUsed = Math.max(heapUsed, maxHeapUsed)
      averageHeapUsed = (averageHeapUsed * probes + heapUsed) / (probes + 1)

      probes += 1
    }
  }, probeInterval)

  function write() {
    console.log(
      `Memory stats (mb):
  Heap Size\tnow:${mb(currentHeapTotal)}\tmin:${mb(minHeapTotal)}\tmax:${mb(maxHeapTotal)}\tavg:${mb(averageHeapTotal)}
  Heap Used\tnow:${mb(currentHeapUsed)}\tmin:${mb(minHeapUsed)}\tmax:${mb(maxHeapUsed)}\tavg:${mb(averageHeapUsed)}`)
  }

  const log = logInterval ? setInterval(write, logInterval) : null

  return () => {
    write()
    clearInterval(probe)
    clearInterval(log)
  }
}
