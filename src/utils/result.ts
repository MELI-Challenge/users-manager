const pair = <A, B>(a: A, b: B): [A, B] => [a, b]

export interface Success<T> {
  readonly kind: 'SUCCESS'

  readonly isSuccess: true

  readonly value: T
}

export interface Failure<T> {
  readonly kind: 'FAILURE'

  readonly isSuccess: false

  readonly value: T
}

export type ResultPlain<TOk, TError> = Success<TOk> | Failure<TError>

interface ResultOps<TOk, TError> {
  readonly map: <TNewOk>(mapper: (v: TOk) => TNewOk) => Result<TNewOk, TError>

  readonly mapFailure: <TNewError>(mapper: (v: TError) => TNewError) => Result<TOk, TNewError>

  readonly bind: <TNewOk>(binder: (v: TOk) => Result<TNewOk, TError>) => Result<TNewOk, TError>

  readonly either: <K>(mapperOk: (v: TOk) => K, mapperError: (v: TError) => K) => K

  readonly iter: (doer: (v: TOk) => void) => void

  readonly iterFailure: (doer: (v: TError) => void) => void

  readonly value: TOk | TError

  readonly toPlain: () => ResultPlain<TOk, TError>

  readonly bindAsync: <TNewOk>(
    binderAsync: (v: TOk) => Promise<Result<TNewOk, TError>>
  ) => Promise<Result<TNewOk, TError>>

  readonly mapAsync: <TNewOk>(mapperAsync: (v: TOk) => Promise<TNewOk>) => Promise<Result<TNewOk, TError>>

  readonly iterAsync: (doer: (v: TOk) => Promise<void>) => Promise<void>
}

export type Result<TOk, TError> = ResultPlain<TOk, TError> & ResultOps<TOk, TError>

export const Success = <TOk, TError>(value: TOk): Result<TOk, TError> => ({
  kind: 'SUCCESS',
  value,
  isSuccess: true,
  map: mapper => Success(mapper(value)),
  mapFailure: _ => Success(value),
  bind: binder => binder(value),
  either: mapperOk => mapperOk(value),
  iter: doer => doer(value),
  iterFailure: _ => undefined,
  toPlain: () => ({ kind: 'SUCCESS', isSuccess: true, value }),
  mapAsync: async mapperAsync => Success(await mapperAsync(value)),
  bindAsync: async binderAsync => await binderAsync(value),
  iterAsync: async doer => await doer(value)
})
const a = Success<string, boolean>('Hola')
export const Failure = <TOk, TError>(value: TError): Result<TOk, TError> => ({
  kind: 'FAILURE',
  value,
  isSuccess: false,
  map: _ => Failure(value),
  mapFailure: mapper => Failure(mapper(value)),
  bind: _ => Failure(value),
  either: (mapperOk, mapperError) => mapperError(value),
  iter: _ => undefined,
  iterFailure: doer => doer(value),
  toPlain: () => ({ kind: 'FAILURE', isSuccess: false, value }),
  mapAsync: async _ => Failure(value),
  bindAsync: async _ => Failure(value),
  iterAsync: async _ => {}
})

export type ResultPromise<TOk, TError> = Promise<Result<TOk, TError>> & {
  readonly value: Promise<Result<TOk, TError>>
  readonly thenBind: <TNewOk>(binder: (value: TOk) => Result<TNewOk, TError>) => ResultPromise<TNewOk, TError>
  readonly thenBindAsync: <TNewOk>(
    binder: (value: TOk) => Promise<Result<TNewOk, TError>>
  ) => ResultPromise<TNewOk, TError>
  readonly thenMap: <TNewOk>(mapper: (value: TOk) => TNewOk) => ResultPromise<TNewOk, TError>
  readonly thenMapAsync: <TNewOk>(mapper: (value: TOk) => Promise<TNewOk>) => ResultPromise<TNewOk, TError>
  readonly thenMapFailure: <TNewError>(mapper: (value: TError) => TNewError) => ResultPromise<TOk, TNewError>
  readonly protect: (onCatch: (e: Error) => TError) => ResultPromise<TOk, TError>
}

export const ResultPromise = {
  Success: <TOk, TError>(value: TOk): ResultPromise<TOk, TError> =>
    ResultPromise.fromPromise(Promise.resolve(Success(value))),
  Failure: <TOk, TError>(value: TError): ResultPromise<TOk, TError> =>
    ResultPromise.fromPromise(Promise.resolve(Failure(value))),
  Result: <TOk, TError>(value: Result<TOk, TError>): ResultPromise<TOk, TError> =>
    ResultPromise.fromPromise(Promise.resolve(value)),
  fromPromise: <TOk, TError>(value: Promise<Result<TOk, TError>>): ResultPromise<TOk, TError> => {
    return {
      value,
      then: (onFulfilled, onRejected) => value.then(onFulfilled, onRejected),
      catch: onRejected => value.catch(onRejected),
      finally: onFinally => value.finally(onFinally),
      [Symbol.toStringTag]: value[Symbol.toStringTag],
      thenBind: binder => ResultPromise.fromPromise(value.then(r => r.bind(binder))),
      thenBindAsync: binderAsync => ResultPromise.fromPromise(value.then(r => r.bindAsync(binderAsync))),
      thenMap: mapper => ResultPromise.fromPromise(value.then(r => r.map(mapper))),
      thenMapAsync: mapper => ResultPromise.fromPromise(value.then(r => r.mapAsync(mapper))),
      thenMapFailure: mapper => ResultPromise.fromPromise(value.then(r => r.mapFailure(mapper))),
      protect: onCatch => ResultPromise.fromPromise(value.catch(e => Failure(onCatch(e))))
    }
  },
  fromThunk: <TOk, TError>(thunk: () => Promise<Result<TOk, TError>>): ResultPromise<TOk, TError> =>
    ResultPromise.fromPromise(thunk()),
  bindArray: <TOk, TError>(array: Promise<Result<TOk, TError>>[]): ResultPromise<TOk[], TError> => {
    const awaitAll = async (arr: TOk[]) => {
      for (let i = 0; i < array.length; i++) {
        const item = await array[i]
        if (!item.isSuccess) return Failure<TOk[], TError>(item.value)
        arr[i] = item.value
      }
      return Success<TOk[], TError>(arr)
    }
    return ResultPromise.fromPromise(awaitAll(new Array(array.length)))
  },
  fromResult: <TOk, TError>(value: Result<TOk, TError>): ResultPromise<TOk, TError> =>
    ResultPromise.fromPromise(Promise.resolve(value))
}

const result = {
  protect: <T>(op: () => T): Result<T, Error> => {
    try {
      return Success(op())
    } catch (error) {
      return Failure(error as Error)
    }
  },
  protectAsync: <T>(op: () => Promise<T>): ResultPromise<T, Error> =>
    ResultPromise.fromThunk(async () => {
      try {
        return Success(await op())
      } catch (error) {
        return Failure(error as Error)
      }
    }),
  bindArray: <TOk, TError>(array: Result<TOk, TError>[]): Result<TOk[], TError> => {
    const arr = new Array(array.length)
    for (let i = 0; i < array.length; i++) {
      const item = array[i]
      if (!item.isSuccess) return Failure(item.value)
      arr[i] = item.value
    }
    return Success(arr)
  },
  partition: <TOk, TError>(array: Result<TOk, TError>[]): [TOk[], TError[]] => {
    const successes: TOk[] = []
    const failures: TError[] = []
    array.forEach(x => {
      if (x.isSuccess) successes.push(x.value)
      else failures.push(x.value)
    })
    return pair(successes, failures)
  }
}

export const Result = Object.assign(
  <TOk, TError>(plainResult: ResultPlain<TOk, TError>): Result<TOk, TError> =>
    plainResult.isSuccess ? Success(plainResult.value) : Failure(plainResult.value),
  result
)

interface ResultArrayOps<TOk, TError> {
  readonly okValues: () => TOk[]
  readonly errorValues: () => TError[]
}
export const ResultArray = <TOk, TError>(value: Result<TOk, TError>[]): ResultArrayOps<TOk, TError> => ({
  okValues: () =>
    value.reduce((acc, result) => {
      result.iter(v => {
        acc.push(v)
      })
      return acc
    }, [] as TOk[]),
  errorValues: () =>
    value.reduce((acc, result) => {
      result.iterFailure(v => {
        acc.push(v)
      })
      return acc
    }, [] as TError[])
})

export const ResultPromiseFailure = <TOk, TError>(failure: TError): ResultPromise<TOk, TError> =>
  ResultPromise.fromThunk(async () => Failure<TOk, TError>(failure))

export const SuccessResultPromise = <TOk, TError>(success: TOk): ResultPromise<TOk, TError> =>
  ResultPromise.fromThunk(async () => Success<TOk, TError>(success))
