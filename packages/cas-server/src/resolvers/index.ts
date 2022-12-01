import { Context, i18n } from '../context'
import { login, logout, register } from './auth'
import { sendSms } from './sms'

export const resolvers = {
  Query: {
    ping: (_parent, _args, context: Context) => {
      console.log('context.i18nOptions', context.i18nOptions, i18n.t('pong', context.i18nOptions))
      return i18n.t('pong', context.i18nOptions)
    },
  },
  Mutation: {
    sendSms,
    register,
    logout,
    login,
  },
}
