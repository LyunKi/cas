export default {
  pong: '砰',
  schema: {
    mobile: {
      limit: '您的手机号 {{mobile}} 不正确',
    },
    password: {
      limit: '您的密码有误',
    },
    verificationCode: {
      limit: '您的验证码有误',
    },
    service: {
      limit: '所属服务信息有误',
    },
  },
  errors: {
    internalServerError: '服务器内部错误',
    badRequest: '错误请求',
    business: {
      invalid_auth: '您的登录信息有误',
      mobileRegistered: '您输入的手机号已注册',
      reauth: '您的登录信息已过期，请重新登录',
    },
  },
}
