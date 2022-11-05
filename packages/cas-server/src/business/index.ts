import crypto from 'crypto'
import type { User } from '@prisma/client'
import { encodeJwt, verifyJwt } from '../common/auth'
import { LEGAL_TOKEN_FLAG, TOKEN_DURATION_SECONDS } from '../common/constants'
import { CustomError, genCustomError } from '../common/error'
import { redis } from '../context'

export function generateSmsKey(mobile: string) {
  return `sms:${mobile}`
}

export function generateTgtKey(tgt: string) {
  return `tgt:${tgt}`
}
export function generateStKey(st: string) {
  return `st:${st}`
}

export async function verifySmsCode(mobile: string, code: string) {
  const storedCode = await redis.get(generateSmsKey(mobile))
  return storedCode?.length === 6 && storedCode === code
}

export async function encodeTgt(user: Omit<User, 'password'>) {
  const tgt: string = await encodeJwt({
    ...user,
  })
  await redis.setEx(
    generateTgtKey(tgt),
    TOKEN_DURATION_SECONDS,
    LEGAL_TOKEN_FLAG
  )
  return tgt
}

export async function invalidateTgt(tgt: string) {
  await redis.del(generateTgtKey(tgt))
}

export async function verifyTgt(tgt: string) {
  const legalFlag = redis.get(generateTgtKey(tgt))
  if (!legalFlag) {
    throw genCustomError({
      extensions: { customError: CustomError.INTERNAL_SERVER_ERROR },
    })
  }
  return await verifyJwt(tgt)
}

export async function encodeSt(tgt: string, service: string) {
  const st = `${service}:${crypto.randomUUID()}`
  await redis.setEx(generateStKey(st), TOKEN_DURATION_SECONDS, tgt)
  return st
}

export async function verifySt(st: string) {
  const tgt = redis.get(generateStKey(st))
  if (!tgt) {
    throw genCustomError({
      extensions: { customError: CustomError.INTERNAL_SERVER_ERROR },
    })
  }
  return tgt
}
