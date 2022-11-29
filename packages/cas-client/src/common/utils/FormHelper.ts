import { FormikProps } from 'formik'
import I18n from '../../i18n'

interface GenerateFormInputPropsInput<T, F extends keyof T> {
  formikProps: FormikProps<T>
  fieldName: F
}

export default class FormHelper {
  public static generateFormInputProps<T, F extends keyof T>(
    input: GenerateFormInputPropsInput<T, F>
  ): any {
    const { formikProps, fieldName } = input
    const { values, errors, handleChange, handleBlur, touched } = formikProps
    return {
      onChange: handleChange(fieldName),
      onBlur: handleBlur(fieldName),
      placeholder: I18n.t(`schema.${fieldName}.placeholder`),
      value: values[fieldName],
      error: touched[fieldName] && errors[fieldName],
    }
  }
}
