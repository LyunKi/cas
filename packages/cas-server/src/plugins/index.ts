import type { ApolloServerPlugin } from '@apollo/server'
import isEmpty from 'lodash'
import { Context, redis } from '../context'

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
      async willSendResponse(ctx) {
        if (ctx.response.body.kind === 'incremental') {
          return
        }
        const errors = ctx.response.body.singleResult.errors
        if (isEmpty(errors)) {
          return
        }
        // TODO: Handle errors
        const { i18nOptions } = ctx.contextValue
        console.log(
          'ErrorResponsePlugin willSendResponse',
          i18nOptions,
          ctx.response.body.singleResult
        )
      },
    }
  },
}

export const ShutdownPlugin = {
  async serverWillStart() {
    return {
      async serverWillStop() {
        await redis.disconnect()
      },
    }
  },
}
