const MESSAGES = {
    companyName: 'Cloud Dragon',
    business: {
        newUserRegister: 'Register',
        loginByPassword: 'Login by password',
        loginByVerifySmsCode: 'Login by SMS code',
        authing: 'Verifying...'
    },
    loading: '加载中',
    countryPicker: {
        title: '国家或地区',
        placeholder: '请选择您所在的国家或地区',
    },
    registration: {
        welcome: '有朋自远方来，不亦乐乎？',
        tip: '完成注册流程，即刻享有云龙开发者团队下所有应用的会员权限',
    },
    actions: {
        register: '注册',
        login: '登录',
    },
    errors: {
        required: '{{name}}不能为空',
    },
    schema: {
        verificationCode: {
            name: '验证码',
            placeholder: '请输入您的验证码',
            sendTip: '发送验证码',
        },
        password: {
            name: '密码',
            placeholder: '请输入您的密码',
            limit: '密码长度不能超过30个字符',
        },
        mobile: {
            name: '手机号',
            placeholder: '请输入您的手机号',
            limit: '您输入的手机号不合法',
        },
    },
}

export default MESSAGES
