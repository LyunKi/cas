import Sender from '../Sender'
import EvaIcon from '../EvaIcon'
import FormInput, { FormInputProps } from '../FormInput'
import I18n from '../../i18n'
import MobileHelper, { Mobile } from '../../common/utils/MobileHelper'
import { Api } from '../../common/utils'
import { SMS_CODE } from '../../common/constants'

export interface VerificationCodeInputProps extends FormInputProps {
  mobile: Mobile
}

export default function VerificationCodeInput(
  props: VerificationCodeInputProps
) {
  const { mobile } = props
  return (
    <FormInput
      accessoryLeft={(props) => (
        <EvaIcon {...props} name="message-square-outline" />
      )}
      accessoryRight={
        <Sender
          text={I18n.t('schema.verificationCode.sendTip')}
          disabled={!MobileHelper.isValid(mobile)}
          onSend={() => {
            return Api.post(
              SMS_CODE,
              {
                mobile: MobileHelper.formatMobile(mobile),
              },
              { showErrorToast: true }
            )
          }}
        />
      }
      {...props}
    />
  )
}
