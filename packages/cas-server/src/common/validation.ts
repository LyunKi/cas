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
        prev[fieldName] = this[schemaName]()
        return prev
      }, {} as SchemaMap)
    )
  }

  //@ts-ignore
  private mobile() {
    return Yup.string().test({
      name: 'valid-mobile',
      message: 'schema.mobile.limit',
      async test(value?: string) {
        return !!value && MobileLib.isValidPhoneNumber(value)
      },
    })
  }
}

export const ValidationSchema = new ValidationSchemaClass()
