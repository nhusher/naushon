import {filter} from "./filter";
import {iterator} from "./iterator";
import {map} from "./map";

describe('track', () => {
  it('should do a thing', async () => {
    const filterThree = filter((n: number) => n !== 3)
    const incrementer = map((n: number) => n + 1)
    const doubler = map((n: number) => n * 2)

    const pipe = doubler(filterThree(incrementer(iterator([1, 2, 3, 4]))))

    for await (const val of pipe) {
      console.log(pipe.state)
      console.log(val)
    }
  })
})