//functional style
import * as R from 'ramda'
const isDivisibleBy = R.curry(R.pipe(R.modulo, R.equals(0)))
const isDivisibleBy400 = isDivisibleBy(R.__, 400)
const notIsDivisibleBy100 = R.pipe(isDivisibleBy(R.__, 100), R.not)
const isDivisibleBy4AndNot100 = R.allPass([isDivisibleBy(R.__, 4), notIsDivisibleBy100])
export const isLeapYear = R.anyPass([isDivisibleBy4AndNot100, isDivisibleBy400])

//plain style:
// export function isLeapYear (number) {
//   return (number % 4 === 0 && !(number % 100 === 0) || number % 400 === 0)
// }

//refactored plain style:
// function isDivisibleBy (number, divisor) {
//   return number % divisor === 0
// }
// export function isLeapYear (number) {
//   return (isDivisibleBy(number, 4) && !isDivisibleBy(number, 100) || isDivisibleBy(number, 400))
// }
