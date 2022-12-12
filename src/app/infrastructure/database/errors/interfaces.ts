type BaseError<TCode extends string> = {
  readonly type: 'InfrastructureFailure'
  readonly code: TCode
  readonly message?: string
}

type GetUserError = BaseError<'GetUserError'>
type UserNotFound = BaseError<'UserNotFound'>

export type DatabaseOperationError = GetUserError | UserNotFound
