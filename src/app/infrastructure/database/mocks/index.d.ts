import { UserModel } from '../../input/user/interfaces'

export default class MockUtils {
  private _readJSON(
    jsonFile: Record<string, any>,
    parameter: string | null,
    timeout: number,
    notFoundErrorMessage: string
  ): Promise<any>

  getUser(): Promise<UserModel>
}
