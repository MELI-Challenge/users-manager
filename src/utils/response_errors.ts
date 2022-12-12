import { HttpStatusCode } from './httpStatusCodes'

export enum ErrorsResponseCodes {
  ValidateSchemaError = HttpStatusCode.BadRequest,
  UserNotFound = HttpStatusCode.NotFound,
  GetUserError = HttpStatusCode.InternalServerError,
  Unknown = HttpStatusCode.InternalServerError
}

type ErrorCodes = 'ValidateSchemaError' | 'UserNotFound' | 'GetUserError' | 'Unknown'

export const getErrorStatusCode = (code: ErrorCodes) => {
  return ErrorsResponseCodes[code as keyof typeof ErrorsResponseCodes]
}
