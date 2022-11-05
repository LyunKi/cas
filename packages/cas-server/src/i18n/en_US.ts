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
    badRequest: 'Bad Request',
    business: {
      invalid_auth: 'Your login request is invalid',
      mobileRegistered: 'The typed phone number had been registered',
      reauth: 'Your login session had outdated, please login again',
    },
  },
}
