import joi from '@hapi/joi'
import { Failure, Result, Success } from './result'
import { Config } from './interfaces'
import { id } from './utils'

const configurationVariablesSchema = joi
  .object<Config>({
    PORT: joi.number().required()
  })
  .unknown(true)

const validateConfig = (): Result<Config, string> => {
  const { error, value } = configurationVariablesSchema.validate(process.env)
  if (error) {
    return Failure(error.details[0].message)
  }

  return Success(value)
}

export const loadAndValidateConfig = (): Result<Config, string> => validateConfig().map(id).mapFailure(id)
