import assert from 'assert'
import { interpose } from './interpose'
import { sequence } from './sequence'

describe('interpose', () => {
  it('should insert a record between every record of the source', async () => {
    const input = [1, 2, 'red', 'blue', '!']
    const output = await sequence(interpose('🐠'), input)

    assert.deepStrictEqual(output, [1, '🐠', 2, '🐠', 'red', '🐠', 'blue', '🐠', '!'])
  })
  it('it should not append the record to the end', async () => {
    const input = [1]
    const output = await sequence(interpose('🐠'), input)

    assert.deepStrictEqual(output, [1])
  })
  it('it should not append the record to the end when the input is empty', async () => {
    const input: any[] = []
    const output = await sequence(interpose('🐠'), input)

    assert.deepStrictEqual(output, [])
  })
})
