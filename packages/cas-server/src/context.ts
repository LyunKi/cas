import { PrismaClient } from '@prisma/client'
import { I18n } from 'i18n-js/dist/require'
import { createClient } from 'redis'
import { AcceptLanguageParser } from '@cloud-dragon/common-utils'
import type { I18nOptions } from 'i18n-js/typings'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './common/constants'
import { translations } from './i18n'

const prisma = new PrismaClient()

const { REDIS_PASS } = process.env

export const redis = createClient({
  //redis[s]://[[username][:password]@][host][:port][/db-number]
  url: `redis://:${REDIS_PASS}@127.0.0.1/`,
})

export type RedisClient = typeof redis

export const i18n = new I18n(translations)

i18n.defaultLocale = DEFAULT_LOCALE
i18n.enableFallback = true
i18n.missingBehavior = 'guess'

export interface Context {
  prisma: PrismaClient
  i18nOptions: I18nOptions
}

export async function createContext(args) {
  const { req } = args
  const acceptLanguage = req.headers['accept-language']
  const optimalLocale = AcceptLanguageParser.pick(
    acceptLanguage,
    SUPPORTED_LOCALES
  )
  const i18nOptions: any = {}
  if (optimalLocale) {
    i18nOptions.locale = 'zh-CN'
  }

  if (!redis.isReady) {
    await redis.connect()
  }
  return { prisma, i18nOptions }
}
