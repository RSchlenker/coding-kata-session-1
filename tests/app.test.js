import {isLeapYear} from '../src/app.js'

it('should be divisible by 4', () => {
    expect(isLeapYear(12)).toBe(true)
})

it('should detect non leap year', () => {
    expect(isLeapYear(1)).toBe(false)
})

it('should not be divisible by 100', () => {
    expect(isLeapYear(100)).toBe(false)
})

it('should be divisible by 400', () => {
    expect(isLeapYear(400)).toBe(true)
})
it.each`
year | expectedResult
${4} | ${true}
${2001} | ${false}
${1996} | ${true}
${1900} | ${false}
${2000} | ${true}
`
('Should check if $year is leap year: $expectedResult', ({year, expectedResult}) => {
    expect(isLeapYear(year)).toBe(expectedResult)
})
