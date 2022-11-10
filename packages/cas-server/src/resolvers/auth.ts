import omit from 'lodash/omit'
import {
  encodeSt,
  encodeTgt,
  invalidateSt,
  invalidateTgt,
  verifySmsCode,
  verifySt,
} from '../business'
import { encrypt } from '../common/auth'
import { CustomError, genCustomError } from '../common/error'
import { ValidationSchema } from '../common/validation'
import type { MutationResolvers } from '../generated/schema'

export const register: MutationResolvers['register'] = async (
  _parent,
  args,
  context
) => {
  const { req } = args
  const { password, mobile, verificationCode, service } = req
  const reqSchema = ValidationSchema.load([
    'password',
    'mobile',
    'verificationCode',
    'service',
  ])
  try {
    await reqSchema.validate(req)
  } catch (e: any) {
    throw genCustomError({
      originalError: e,
      extensions: {
        customError: CustomError.INVALID_REQUEST_PARAMS,
        i18nArgs: {
          mobile,
        },
      },
    })
  }
  const { prisma } = context
  const user = await prisma.user.findFirst({
    where: {
      mobile,
    },
  })
  if (user) {
    throw genCustomError({
      extensions: {
        customError: CustomError.MOBILE_REGISTERED_ERROR,
      },
    })
  }
  if (!(await verifySmsCode(mobile, verificationCode))) {
    throw genCustomError({
      extensions: {
        message: 'schema.verificationCode.limit',
        customError: CustomError.INVALID_REQUEST_PARAMS,
      },
    })
  }
  const created = await prisma.user.create({
    data: {
      provider: service ?? null,
      password: encrypt(password),
      mobile,
    },
  })
  return { id: created.id }
}

export const login: MutationResolvers['login'] = async (
  _parent,
  args,
  context
) => {
  const { req } = args
  const { password, account, service } = req
  const reqSchema = ValidationSchema.load([
    'password',
    { fieldName: 'account', schemaName: 'mobile' },
    'service',
  ])
  try {
    await reqSchema.validate(req)
  } catch (e: any) {
    throw genCustomError({
      originalError: e,
      extensions: {
        customError: CustomError.INVALID_REQUEST_PARAMS,
        i18nArgs: {
          mobile: account,
        },
      },
    })
  }
  const { prisma } = context
  const user = await prisma.user.findFirst({
    where: {
      mobile: account,
    },
  })
  if (!user || encrypt(password) === user.password) {
    throw genCustomError({
      extensions: {
        customError: CustomError.INVALID_AUTH,
      },
    })
  }
  const tgt = await encodeTgt(omit(user, 'password'))
  const st = await encodeSt(tgt, service)
  return {
    tgt,
    st,
  }
}

export const logout: MutationResolvers['logout'] = async (_parent, args) => {
  const { req } = args
  const { st, invalidateTgtFlag } = req
  if (invalidateTgtFlag) {
    const tgt = await verifySt(st)
    await invalidateTgt(tgt)
  }
  await invalidateSt(st)
  return !!invalidateTgtFlag
}
