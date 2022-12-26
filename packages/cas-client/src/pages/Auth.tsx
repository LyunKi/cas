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
  FormField,
} from '@cloud-design/components'
import { gql, useMutation } from '@apollo/client'
import { Schema, Storage } from '../common/utils'
import { TGT_STORAGE_KEY } from '../common/constants/auth'
import { Logger } from '../common/utils/Logger'
import I18n from '../i18n'

interface LoginProps {
  service: string | null
  redirectUrl: string | null
}

const VERIFY_TGT = gql`
  mutation verifyTgt {
    st
  }
`

function useTgtCheck(params) {
  const { service, redirectUrl, setVerifying } = params
  const [verifyTgt] = useMutation(VERIFY_TGT)
  useEffect(() => {
    const checkTgt = async () => {
      const tgt = await Storage.getItem<string>(TGT_STORAGE_KEY)
      if (!tgt) {
        setVerifying(false)
        return
      }
      try {
        const { data } = await verifyTgt({
          variables: {
            tgt,
            service,
          },
        })
        if (redirectUrl) {
          const url = new URL(redirectUrl)
          url.searchParams?.set('st', data.st)
          window.location.replace(url)
        }
      } catch (e) {
        Logger.info('Failed to verify tgt: ', e)
      } finally {
        setVerifying(false)
      }
    }
    checkTgt()
  }, [service, redirectUrl, verifyTgt, setVerifying])
}

const INITIAL_VALUES = {
  password: '',
  mobile: {
    countryCode: '',
    number: '',
  },
}

const TOKEN_DURATION = 2 * 7 * 24 * 3600 * 1000

function LoginByPasswordForm(props) {
  const { redirectUrl, service, verifying } = props
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
        {(formConfig) => {
          return (
            <View ts={{ flexDirection: 'column' }}>
              <FormField
                name="account"
                ts={{ height: '$rem:4' }}
                formConfig={formConfig}
                renderField={(props) => (
                  <Input
                    {...props}
                    placeholder={I18n.t('schema.mobile.placeholder')}
                  />
                )}
              />
              <FormField
                name="password"
                ts={{ height: '$rem:4' }}
                formConfig={formConfig}
                renderField={(props) => (
                  <Input
                    {...props}
                    format={{
                      type: 'password',
                    }}
                    placeholder={I18n.t('schema.password.placeholder')}
                  />
                )}
              />
              <View ts={{ justifyContent: 'space-between', height: '$rem:2' }}>
                <Button
                  loading={verifying}
                  loadingText={I18n.t('business.authing')}
                  ts={{ height: '$rem:1', paddingHorizontal: '$rem:1' }}
                  textTs={{ fontSize: '$fontSize.sm' }}
                  variant="link"
                  status="primary"
                  value={I18n.t('business.loginByPassword')}
                />
                <Button
                  loading={verifying}
                  loadingText={I18n.t('business.authing')}
                  ts={{ height: '$rem:1', paddingHorizontal: '$rem:1' }}
                  textTs={{ fontSize: '$fontSize.sm' }}
                  variant="link"
                  status="primary"
                  value={I18n.t('business.loginByVerifySmsCode')}
                />
              </View>
              <Button
                loading={verifying}
                loadingText={I18n.t('business.authing')}
                status="primary"
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
  LOGIN_BY_PASSWORD,
  LOGIN_BY_VERIFYCODE,
  REGISTER,
}

export default function Login(props: LoginProps) {
  const [type, setType] = useState(AuthType.LOGIN_BY_PASSWORD)
  const { service, redirectUrl } = props
  const [verifying, setVerifying] = useState(true)
  useTgtCheck({ service, redirectUrl, setVerifying })
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
          {type === AuthType.LOGIN_BY_PASSWORD && (
            <LoginByPasswordForm
              verifying={verifying}
              service={service}
              redirectUrl={redirectUrl}
            />
          )}
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
          {type !== AuthType.REGISTER && (
            <Button
              loading={verifying}
              loadingText={I18n.t('business.authing')}
              ts={{ height: '$rem:3' }}
              status="primary"
              variant="link"
              value={I18n.t('business.newUserRegister')}
            />
          )}
        </View>
      </View>
    </SafeArea>
  )
}
