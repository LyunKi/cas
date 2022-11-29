import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Formik } from 'formik'
import * as Yup from 'yup'
import React from 'react'
import {
  Divider,
  SafeArea,
  View,
  Text,
  Button,
  TopNavigation,
} from '@cloud-design/components'
import { RootStackParamList } from '../types'
import { MobileInput, VerificationCodeInput } from '../components'
import { Api, FormHelper, Schema } from '../common/utils'
import I18n from '../i18n'
import MobileHelper from '../common/utils/MobileHelper'
import { REGISTER } from '../common/constants'

interface SignUpProps
  extends NativeStackScreenProps<RootStackParamList, 'SignUp'> {}

const INITIAL_VALUES = {
  password: '',
  mobile: {
    countryCode: '',
    number: '',
  },
  verificationCode: '',
}

function SignUp(props: SignUpProps) {
  const { route } = props
  const service = route.params?.service
  const signUpSchema = Yup.object().shape(
    Schema.load(['mobile', 'password', 'verificationCode'])
  )
  const register = React.useCallback(
    async (values) => {
      await Api.post(
        REGISTER,
        {
          ...values,
          service,
          mobile: MobileHelper.formatMobile(values.mobile),
        },
        { showErrorToast: true }
      )
    },
    [service]
  )
  return (
    <SafeArea>
      <TopNavigation title={I18n.t('companyName')} />
      <Divider />
      <View>
        <Text value={I18n.t('registration.welcome')}></Text>
        <Text value={I18n.t('registration.tip')} />
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={signUpSchema}
          onSubmit={register}
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
                <VerificationCodeInput
                  mobile={values.mobile}
                  {...FormHelper.generateFormInputProps({
                    formikProps,
                    fieldName: 'verificationCode',
                  })}
                />
                <PasswordInput
                  {...FormHelper.generateFormInputProps({
                    formikProps,
                    fieldName: 'password',
                  })}
                />
                <Button
                  onPress={() => handleSubmit()}
                  value={I18n.t('actions.register')}
                />
              </>
            )
          }}
        </Formik>
      </View>
    </SafeArea>
  )
}

export default SignUp
