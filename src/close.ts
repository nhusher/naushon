// Streams are destroyable
interface Destroyable {
  destroy (): void
}

// Generators are returnable
interface Returnable {
  return (val?: any): void
}

function isDestroyable (s: any): s is Destroyable {
  try {
    return "destroy" in s
  } catch (e) {
    return false
  }
}

function isReturnable (s: any): s is Returnable {
  try {
    return "return" in s
  } catch (e) {
    return false
  }
}

/**
 * Closes an iterator, to be used within a transformer function to close
 * upstream sources of data, allowing them to clean up if necessary.
 *
 * @param it
 */
export function close (it: any): void {
  if (isDestroyable(it)) it.destroy()
  if (isReturnable(it)) it.return()
}
