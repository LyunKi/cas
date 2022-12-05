import React, { useCallback, useEffect, useState } from 'react'
import { Image } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  Button,
  SafeArea,
  View,
  Text,
  ThemeManager,
  Input,
} from '@cloud-design/components'
import { FormHelper, Schema, Storage } from '../common/utils'
import { TGT_STORAGE_KEY } from '../common/constants/auth'
import { Logger } from '../common/utils/Logger'
import I18n from '../i18n'
import { MobileInput } from '../components'

interface LoginProps {
  service: string | null
  redirectUrl: string | null
}

async function checkTgt(params) {
  const tgt = await Storage.getItem<string>(TGT_STORAGE_KEY)
  const { service, redirectUrl, setValidating } = params
  if (!tgt) {
    setValidating(false)
    return
  }
  try {
    // const { st } = await Api.post(VERIFY_TGT, { service, tgt })
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
    <View
      ts={{
        flexDirection: 'column',
        paddingHorizontal: '$rem:1',
        paddingVertical: '$rem:2.5',
        width: '100%',
      }}
    >
      <Text
        ts={{
          fontSize: 22,
          paddingBottom: '$rem:2',
          fontWeight: '$fontWeight.semibold',
        }}
        value={I18n.t('business.loginByPassword')}
      />
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
            <View ts={{ flexDirection: 'column', gap: '$rem:1.5' }}>
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
              <View>
                <Text value="1" />
                <Text value="2" />
              </View>
              <Button
                status="primary"
                onPress={() => handleSubmit()}
                value={I18n.t('actions.login')}
              />
            </View>
          )
        }}
      </Formik>
    </View>
  )
}

enum AuthType {
  LOGINBYPASSWORD,
  LOGINBYVERIFYCODE,
  REGISTER,
}

export default function Login(props: LoginProps) {
  const [type, setType] = useState(AuthType.LOGINBYPASSWORD)
  const { service, redirectUrl } = props
  // const [, setValidating] = useState(true)
  // useTgtCheck({ service, redirectUrl, setValidating })
  return (
    <SafeArea
      ts={{
        backgroundColor: '$color.brand.50',
        flexDirection: 'column',
        minHeight: '$vh:100',
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
          source={require('../../assets/images/logo.jpg')}
        />
        <Text
          size="lg"
          ts={{
            marginTop: '$rem:1.5',
            color: '$color.font.white',
            fontWeight: '$fontWeight.semibold',
            fontSize: 22,
          }}
          value={I18n.t('companyName')}
        />
      </View>
      <View
        ts={{
          marginHorizontal: '$rem:1',
          position: 'relative',
          top: '$rem:-6',
          display: 'block',
          marginTop: '$rem:1.5',
        }}
      >
        <View
          ts={{
            backgroundColor: '$color.bg.layout',
            width: 'calc(100% - 1rem)',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 2,
            borderRadius: '$rem:0.75',
            minHeight: 391,
          }}
        >
          <LoginForm service={service} redirectUrl={redirectUrl} />
        </View>
        <View
          ts={{
            backgroundColor: '$color.bg.secondaryGrey',
            width: 'calc(100% - 1rem)',
            posistion: 'absolute',
            left: '$rem:1',
            top: '$rem:3',
            zIndex: 1,
            borderRadius: '$rem:0.75',
            minHeight: 391,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <Button
            ts={{ height: '$rem:3' }}
            status="primary"
            variant="link"
            value={I18n.t('business.newUserRegister')}
          />
        </View>
      </View>
    </SafeArea>
  )
}
