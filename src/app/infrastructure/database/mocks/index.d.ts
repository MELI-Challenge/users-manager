import { LevelModel } from '../../input/level/interfaces'
import { PaymentModel } from '../../input/payments/interfaces'
import { PurchaseModel } from '../../input/purchases/interfaces'
import { RestrictionModel } from '../../input/restrictions/interfaces'
import { ShipmentModel } from '../../input/shipment/interfaces'
import { UserModel } from '../../input/user/interfaces'

export default class MockUtils {
  private _readJSON(
    jsonFile: Record<string, any>,
    parameter: string | null,
    timeout: number,
    notFoundErrorMessage: string
  ): Promise<any>

  getUser(): Promise<UserModel>

  getUserRestrictions(userId: string): Promise<RestrictionModel[]>

  getUserPurchases(userId: string): Promise<PurchaseModel[]>

  getLevel(levelId: string): Promise<LevelModel>

  getShipment(shipmentId: string): Promise<ShipmentModel>

  getPayment(paymentId: string): Promise<PaymentModel>
}
