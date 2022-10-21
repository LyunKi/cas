import type { Context } from '@cas-server/context'

function generateSmsCode(mobile: string) {
  return mobile.slice(0, 6)
}

function generateSmsKey(mobile: string) {
  return `sms:${mobile}`
}

interface SendSmsArgs {
  mobile: string
}

const SMS_CODE_EXPIRE = 60

export async function sendSms(_parent, args: SendSmsArgs, context: Context) {
  const { mobile } = args
  const { redis } = context
  const code = generateSmsCode(mobile)
  const key = generateSmsKey(mobile)
  await redis.setEx(key, SMS_CODE_EXPIRE, code)
  return mobile
}
