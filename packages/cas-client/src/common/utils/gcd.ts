/**
 * 计算任意个数的最大公约数
 *
 * @export
 * @param {...Array<number>} numbers
 * @returns
 */
export function gcd(...numbers: Array<number>): number {
  if (numbers.length < 1) {
    throw new Error('Please provide at least one number')
  }
  return numbers.reduce((first, second) => {
    if (second === 0) {
      return first
    }
    return gcd(second, first % second)
  })
}
