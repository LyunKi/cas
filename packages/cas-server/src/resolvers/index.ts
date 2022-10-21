import { sendSms } from './sms'

export const resolvers = {
  Query: {
    ping: () => {
      return 'pong'
    },
  },
  Mutation: {
    sendSms,
  },
}
