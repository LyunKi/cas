import isNumber from 'lodash/isNumber'

export const BASE_FONT_SIZE = 16

export function remToPx(rem: number): string {
  return `${rem * BASE_FONT_SIZE}px`
}

export function padding(num: number | string): string {
  const px = isNumber(num) ? `${num}px` : num
  return `paddingVertical: ${px};paddingHorizon:${px}`
}
