import {
  GraphQLError,
  GraphQLErrorExtensions,
  GraphQLErrorOptions,
} from 'graphql'

export const CustomError = {
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: 'errors.internalServerError',
  },
  INVALID_REQUEST_PARAMS: {
    code: 'BAD_REQUEST',
    status: 400,
    message: 'errors.badRequest',
  },
  MOBILE_REGISTERED_ERROR: {
    message: 'errors.business.mobileRegistered',
    code: 'MOBILE_REGISTERED_ERROR',
    status: 409,
  },
  INVALID_AUTH: {
    message: 'errorS.business.invalid_auth',
    code: 'INVALID_AUTH',
    status: 401,
  },
  REAUTH: {
    message: 'errorS.business.reauth',
    code: 'REAUTH',
    status: 401,
  },
}

export type CustomErrorType = typeof CustomError.INTERNAL_SERVER_ERROR

export interface CustomErrorParams extends GraphQLErrorOptions {
  message?: string
  extensions: GraphQLErrorExtensions & {
    customError: CustomErrorType
  }
}

const DEFAULT_ERROR_MESSAGE = 'Internal Server Error'

export function genCustomError(parmas: CustomErrorParams) {
  const { message, originalError, extensions, ...rest } = parmas
  const { customError, http, ...restExtensions } = extensions
  const { code, status, message: customErrorMessage } = customError
  console.log('mobile', message ?? originalError?.message ?? customErrorMessage)
  return new GraphQLError(
    message ??
      originalError?.message ??
      customErrorMessage ??
      DEFAULT_ERROR_MESSAGE,
    {
      ...rest,
      originalError,
      extensions: {
        ...restExtensions,
        code,
        http: {
          ...(http as any),
          status,
        },
        isCustom: true,
      },
    }
  )
}
