import assert from 'assert'
import { count } from './count'
import { identity } from './identity'

describe('count', () => {
  it('should count the characters in a string', async () => {
    const s = "hello"
    assert.equal(await count(identity, s), s.length)
  })
  it('should count the items in an array', async () => {
    const s = [1,2,3,4,5]
    assert.equal(await count(identity, s), s.length)
  })
})
