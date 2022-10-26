import { genCustomError, CustomError } from '../common/error'
import { ValidationSchema } from '../common/validation'
import type { Context } from '../context'

export function generateSmsCode(mobile: string) {
  return mobile.slice(0, 6)
}

export function generateSmsKey(mobile: string) {
  return `sms:${mobile}`
}

export const SMS_CODE_EXPIRE = 60
interface SendSmsArgs {
  req: {
    mobile: string
  }
}

export async function sendSms(_parent, args: SendSmsArgs, context: Context) {
  const { req } = args
  const { redis } = context
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
