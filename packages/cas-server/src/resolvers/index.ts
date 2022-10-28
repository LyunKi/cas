import { Context, i18n } from '../context'
import { register } from './auth'
import { sendSms } from './sms'

export const resolvers = {
  Query: {
    ping: (_parent, _args, context: Context) => {
      return i18n.t('pong', context.i18nOptions)
    },
  },
  Mutation: {
    sendSms,
    register,
  },
}
