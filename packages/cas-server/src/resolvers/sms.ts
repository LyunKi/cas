import { generateSmsKey } from '../business'
import { genCustomError, CustomError } from '../common/error'
import { ValidationSchema } from '../common/validation'
import { redis } from '../context'
import type { MutationResolvers } from '../generated/schema'

export function generateSmsCode(mobile: string) {
  return mobile.slice(0, 6)
}

export const SMS_CODE_EXPIRE = 60

export const sendSms: MutationResolvers['sendSms'] = async (
  _parent,
  args,
  context
) => {
  const { req } = args
  const reqSchema = ValidationSchema.load(['mobile'])
  try {
    await reqSchema.validate(req)
  } catch (e: any) {
    throw genCustomError({
      originalError: e,
      extensions: {
        customError: CustomError.INVALID_REQUEST_PARAMS,
        i18nArgs: {
          mobile: e.params.value,
        },
      },
    })
  }
  const { mobile } = req
  const key = generateSmsKey(mobile)
  const code = generateSmsCode(mobile)
  await redis.setEx(key, SMS_CODE_EXPIRE, code)
  return mobile
}
