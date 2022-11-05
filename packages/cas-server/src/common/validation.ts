import isString from 'lodash/isString'
import * as Yup from 'yup'
import * as MobileLib from 'libphonenumber-js'

interface SchemaMap {
  [key: string]: Yup.BaseSchema
}

interface ComplexSchema {
  schemaName: string
  fieldName: string
}

const SCHEMAS = {
  mobile: Yup.string().test({
    message: 'schema.mobile.limit',
    async test(value?: string) {
      return !!value && MobileLib.isValidPhoneNumber(value)
    },
  }),
  password: Yup.string()
    .min(1, 'schema.password.limit')
    .max(30, 'schema.password.limit')
    .required('schema.password.limit'),
  verificationCode: Yup.string()
    .length(6, 'schema.verificationCode.limit')
    .required('schema.verificationCode.limit'),
  service: Yup.string().nullable(),
}

class ValidationSchemaClass {
  public load(schemas: Array<string | ComplexSchema>) {
    return Yup.object().shape(
      schemas.reduce((prev, current) => {
        let fieldName
        let schemaName
        if (isString(current)) {
          fieldName = current
          schemaName = current
        } else {
          fieldName = current.fieldName
          schemaName = current.schemaName
        }
        prev[fieldName] = SCHEMAS[schemaName]
        return prev
      }, {} as SchemaMap)
    )
  }
}

export const ValidationSchema = new ValidationSchemaClass()
