import type { ApolloServerPlugin } from '@apollo/server'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import get from 'lodash/get'
import { CustomError } from '../common/error'
import { Context, i18n, redis } from '../context'

export const LoggerPlugin: ApolloServerPlugin<Context> = {
  async requestDidStart(ctx) {
    // TODO: Handle log
    console.log('LoggerPlugin request started!', ctx.request)
    return {
      async willSendResponse(context) {
        console.log('LoggerPlugin willSendResponse!', context.response)
      },
    }
  },
}

export const ErrorResponsePlugin: ApolloServerPlugin<Context> = {
  async requestDidStart() {
    return {
      async didEncounterErrors(ctx) {
        const errors = ctx.errors
        if (isEmpty(errors)) {
          return
        }
        const { i18nOptions } = ctx.contextValue
        errors?.forEach((error) => {
          const handledError = error
          const { extensions = {} } = error
          if (!extensions?.['isCustom']) {
            const internalError = {
              message: handledError.message,
              code: get(handledError, 'extensions.code'),
              status: get(handledError, 'extensions.http.status'),
            }
            handledError.message = i18n.t(
              'errors.internalServerError',
              i18nOptions
            )
            const { code, status } = CustomError.INTERNAL_SERVER_ERROR
            merge(handledError.extensions, {
              code,
              originError: internalError,
              http: {
                status,
              },
            })
          } else {
            const { i18nArgs } = extensions
            handledError.message = i18n.t(error.message, {
              ...i18nOptions,
              ...(i18nArgs as any),
            })
          }
          delete handledError.extensions['i18nArgs']
          delete handledError.extensions['isCustom']
        })
      },
    }
  },
}

export const ShutdownPlugin: ApolloServerPlugin<Context> = {
  async serverWillStart() {
    return {
      async serverWillStop() {
        if (redis.isReady) {
          await redis.disconnect()
        }
      },
    }
  },
}
