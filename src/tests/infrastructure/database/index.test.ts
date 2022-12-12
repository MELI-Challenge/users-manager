import { loadMockDBClient } from '@src/app/infrastructure/database'
import MockUtils from '@src/app/infrastructure/database/mocks'
jest.mock('@src/app/infrastructure/database/mocks')

describe('Database client', () => {
  beforeEach(() => {})
  it('Should return MockUtils class', () => {
    const client = loadMockDBClient()
    client.iter((r) => {
      expect(MockUtils).toHaveBeenCalledTimes(1)
      expect(typeof r).toBe(typeof MockUtils.prototype)
    })
  })
})
