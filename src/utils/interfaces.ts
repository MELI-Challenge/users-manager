import { HttpStatusCode } from './httpStatusCodes'
import { ErrorsResponseCodes } from './response_errors'

export interface Config {
  PORT: number
}

export interface ApiError {
  type: string
  code: string
  status: ErrorsResponseCodes
}
export interface ApiResponse {
  status: HttpStatusCode
  payload: any
}
