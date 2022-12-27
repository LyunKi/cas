import * as Localization from 'expo-localization'
import { memoize } from 'lodash'
import i18n, { Scope, TranslateOptions } from 'i18n-js'
import * as Updates from 'expo-updates'
import { I18nManager } from 'react-native'
import Storage from '../common/utils/Storage'
import zh_CN from './zh_CN'
import en_US from './en_US'

const LanguagePacks = {
  zh_CN,
  en_US,
}

const translate = memoize(
  (key: Scope, config?: TranslateOptions) => i18n.t(key, config),
  (key: Scope, config?: TranslateOptions) =>
    config ? key + JSON.stringify(config) : key
)

export type SupportedLocale = 'zh_CN' | 'en_US'

const DEFAULT_LOCALE: SupportedLocale = 'en_US'

const I18N_STORAGE_KEY = 'user_languages'

export function formatLocale(locale?: string | null): SupportedLocale {
  return locale?.startsWith('zh') ? 'zh_CN' : DEFAULT_LOCALE
}

class I18n {
  static localization: Localization.Localization

  static get currentLocale(): SupportedLocale {
    return formatLocale(I18n.localization?.locale)
  }

  static async init() {
    const userLocalization = (await Localization.getLocalizationAsync()) ?? {}
    userLocalization.locale = formatLocale(userLocalization?.locale)
    const storedLocalization = await Storage.getOrInsert(
      I18N_STORAGE_KEY,
      userLocalization
    )
    I18n.localization = storedLocalization

    const { isRTL, locale } = I18n.localization
    i18n.translations = LanguagePacks
    i18n.defaultLocale = DEFAULT_LOCALE
    i18n.locale = locale
    i18n.fallbacks = true
    if (isRTL) {
      I18nManager.forceRTL(isRTL)
    }
  }

  static async updateLocale(locale: SupportedLocale) {
    if (translate.cache.clear) {
      translate.cache.clear()
    }
    I18n.localization.locale = formatLocale(locale)
    await Storage.setItem(I18N_STORAGE_KEY, I18n.localization)
    await Updates.reloadAsync()
  }

  static t(key: Scope, config?: TranslateOptions) {
    return translate(key, config)
  }
}

export default I18n
