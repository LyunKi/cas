const MESSAGES = {
    companyName: 'Cloud Dragon',
    business: {
        newUserRegister: 'Register',
        loginByPassword: 'Login by password',
        loginByVerifySmsCode: 'Login by SMS code',
        forgetPassword: 'Forgot your password',
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
        login: 'Login',
    },
    errors: {
        required: '{{name}}不能为空',
    },
    schema: {
        verificationCode: {
            name: 'SMS code',
            placeholder: 'Please input your SMS code',
            sendTip: 'Send SMS code',
        },
        password: {
            name: 'Password',
            placeholder: 'Please input your password',
            limit: '密码长度不能超过30个字符',
        },
        mobile: {
            name: 'Mobile',
            placeholder: 'Please input your mobile',
            limit: '您输入的手机号不合法',
        },
    },
}

export default MESSAGES
