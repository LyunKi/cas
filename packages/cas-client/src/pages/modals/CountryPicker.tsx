import { RouteProp } from '@react-navigation/native'
import { CountryPicker } from '../../components'
import I18n from '../../i18n'
import { RootStackParamList } from '../../types'

interface CountryPickerModalProps {
  route: RouteProp<RootStackParamList, 'CountryPicker'>
}

export default function CountryPickerModal(props: CountryPickerModalProps) {
  const { route } = props
  const { countryCode, keyProp, onChange } = route.params
  return (
    <CountryPicker
      keyProp={keyProp}
      country={I18n.getCountryByCode(countryCode)}
      onChange={onChange}
    />
  )
}
