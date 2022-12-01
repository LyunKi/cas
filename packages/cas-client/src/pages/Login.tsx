import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect } from 'react'
import { Image } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  Button,
  Input,
  SafeArea,
  View,
  Text,
  ThemeManager,
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
    <SafeArea
      ts={{
        backgroundColor: '$color.brand.50',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <View
        ts={{
          backgroundColor: '$color.brand.500',
          flexDirection: 'column',
          alignItems: 'center',
          height: 324,
          borderBottomLeftRadius: '$rem:1',
          borderBottomRightRadius: '$rem:1',
        }}
      >
        <Image
          style={ThemeManager.themed({
            width: 90,
            height: 90,
            borderRadius: 20,
            marginTop: '$rem:5',
          })}
          source={require('../../assets/images/logo.png')}
        />
        <Text
          size={'lg'}
          ts={{
            marginTop: '$rem:1.5',
            color: '$color.font.reverse',
            fontWeight: '$fontWeight.semibold',
          }}
          value={I18n.t('companyName')}
        />
      </View>
      <View
        ts={{
          marginHorizontal: '$rem:1',
          posistion: 'relative',
          top: '$rem:-6',
          display: 'block',
          marginTop: '$rem:1.5',
        }}
      >
        <View
          ts={{
            backgroundColor: 'white',
            width: 'calc(100% - 1rem)',
            posistion: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          1
        </View>
        <View
          ts={{
            backgroundColor: 'white',
            width: 'calc(100% - 1rem)',
            posistion: 'absolute',
            left: '$rem:1',
            top: '$rem:3',
          }}
        >
          2
        </View>
      </View>
      {/* <LoginForm service={service} redirectUrl={redirectUrl} /> */}
    </SafeArea>
  )
}
