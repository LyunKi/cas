import { CustomError, genCustomError } from '../common/error'
import { ValidationSchema } from '../common/validation'
import type { MutationResolvers } from '../generated/schema'
import { verifyCode } from './sms'

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
      },
    })
  }
  const { prisma, redis } = context
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
  if (!(await verifyCode(redis, mobile, verificationCode))) {
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
      password,
      mobile,
    },
  })
  return { id: created.id }
}
