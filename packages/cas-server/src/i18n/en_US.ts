export default {
  pong: 'pong',
  schema: {
    mobile: {
      limit: 'Your phone number {{mobile}} is invalid',
    },
    password: {
      limit: 'Your password is invalid',
    },
    verificationCode: {
      limit: 'Your verification code is invalid',
    },
    service: {
      limit: 'The service is invalid',
    },
  },
  errors: {
    internalServerError: 'Internal Server Error',
    business: {
      mobileRegistered: 'The typed phone number had been registered',
    },
  },
}
