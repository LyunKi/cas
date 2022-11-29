import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  Button,
  Divider,
  Input,
  SafeArea,
  TopNavigation,
} from '@cloud-design/components'
import { MobileInput } from '../components'
import Navigator from '../navigation/Navigator'
import { RootStackParamList } from '../types'
import { FormHelper, Schema, Storage } from '../common/utils'
import { TGT_STORAGE_KEY } from '../common/constants/auth'
import { Logger } from '../common/utils/Logger'
import I18n from '../i18n'

interface LoginProps
  extends NativeStackScreenProps<RootStackParamList, 'Login'> {}

async function checkTgt(params) {
  const tgt = await Storage.getItem<string>(TGT_STORAGE_KEY)
  const { service, redirectUrl, setValidating } = params
  if (!tgt) {
    setValidating(false)
    return
  }
  try {
    // const { st } = await Api.post(VERIFY_TGT, { service, tgt })
    Navigator.navigate(redirectUrl, { st })
  } catch (e) {
    Logger.info('Relogin: ', e)
  }
}

function useTgtCheck(params) {
  const { service, redirectUrl, setValidating } = params
  useEffect(() => {
    checkTgt({ service, redirectUrl, setValidating })
  }, [service, redirectUrl, setValidating])
}

const INITIAL_VALUES = {
  password: '',
  mobile: {
    countryCode: '',
    number: '',
  },
}

const TOKEN_DURATION = 2 * 7 * 24 * 3600 * 1000

function LoginForm(props) {
  const { redirectUrl, service } = props
  const loginSchema = Yup.object().shape(Schema.load(['mobile', 'password']))
  const login = useCallback(
    async (values) => {
      // const { st, tgt } = await Api.post(LOGIN, {
      //   ...values,
      //   service,
      //   account: MobileHelper.formatMobile(values.mobile),
      // })
      // await Storage.setItem(TGT_STORAGE_KEY, tgt, TOKEN_DURATION)
      // Navigator.navigate(redirectUrl, { st })
    },
    [redirectUrl, service]
  )
  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={loginSchema}
      onSubmit={login}
    >
      {(formikProps) => {
        const {
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
          handleSubmit,
        } = formikProps
        return (
          <>
            <MobileInput
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={I18n.t('schema.mobile.placeholder')}
              value={values.mobile}
              error={touched.mobile?.number && errors.mobile}
            />
            <Input
              format={{
                type: 'password',
              }}
              {...FormHelper.generateFormInputProps({
                formikProps,
                fieldName: 'password',
              })}
            />
            <Button
              onPress={() => handleSubmit()}
              value={I18n.t('actions.login')}
            />
          </>
        )
      }}
    </Formik>
  )
}

export default function Login(props: LoginProps) {
  const { route } = props
  // const [, setValidating] = useState(true)
  // const { service, redirectUrl } = route.params
  // useTgtCheck({ service, redirectUrl, setValidating })
  return (
    <SafeArea>
      <TopNavigation title={I18n.t('companyName')} />
      <Divider />
      {/* <LoginForm service={service} redirectUrl={redirectUrl} /> */}
    </SafeArea>
  )
}
