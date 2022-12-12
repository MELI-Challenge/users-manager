import { HttpStatusCode } from '@src/utils/httpStatusCodes'
import { ApiError, ApiResponse } from '@src/utils/interfaces'
import { getErrorStatusCode } from '@src/utils/response_errors'
import { ValidateSchemaError } from '@src/utils/schema'
import { DatabaseOperationError } from '../../database/errors/interfaces'

export const mappingErrorHandler = (e: ValidateSchemaError): ApiError => {
  const status = getErrorStatusCode(e.code)
  const error: ApiError = {
    type: e.type,
    code: e.type,
    status
  }
  return error
}

export const handleDatabaseOperationError = (e: DatabaseOperationError): ApiError => {
  const status = getErrorStatusCode(e.code)
  const error: ApiError = { type: e.type, code: e.code, status }
  return error
}

export const mappingSuccessHandler = (payload: any): ApiResponse => {
  const response: ApiResponse = {
    status: HttpStatusCode.Ok,
    payload
  }
  return response
}
