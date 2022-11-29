import * as MobileLib from 'libphonenumber-js'

const COUNTRIES = {}
export interface Mobile {
  countryCode: string
  number: string
}
export default class MobileHelper {
  static formatMobile(mobile: Mobile): string {
    return `${COUNTRIES[mobile.countryCode]?.callingCode}${mobile.number}`
  }
  static isValid(mobile: Mobile): boolean {
    return MobileLib.isValidPhoneNumber(MobileHelper.formatMobile(mobile))
  }
}
