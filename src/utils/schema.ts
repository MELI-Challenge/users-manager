import joi from '@hapi/joi'
import { Result, Failure, Success } from './result'

export type ValidateSchemaError = {
  readonly type: 'ValidateSchemaError'
  readonly code: 'ValidateSchemaError'
  readonly metadata: Record<string, any>
  readonly error: joi.ValidationError
}

const createValidateSchemaError = (metadata: Record<string, any>, error: joi.ValidationError): ValidateSchemaError => {
  return {
    type: 'ValidateSchemaError',
    code: 'ValidateSchemaError',
    metadata,
    error
  }
}

export const validateSchema = <TValue>(
  schema: joi.ObjectSchema<TValue>,
  input: TValue
): Result<TValue, ValidateSchemaError> => {
  const { error, value } = schema.options({ allowUnknown: true }).validate(input)
  return error ? Failure(createValidateSchemaError({ input }, error)) : Success(value as TValue)
}
