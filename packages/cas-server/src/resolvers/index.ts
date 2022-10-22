import type { Context } from '../context'
import { sendSms } from './sms'

export const resolvers = {
  Query: {
    ping: (_parent, _args, context: Context) => {
      return context.i18n?.t('pong')
    },
  },
  Mutation: {
    sendSms,
  },
}
