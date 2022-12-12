import { loadAndValidateConfig } from '@src/utils/config'

describe('Config', () => {
  it('Config should be ok', () => {
    const config = loadAndValidateConfig()
    expect(config.isSuccess).toBeTruthy()
  })
  it('Config should fail if a variable does not exist', () => {
    process.env.PORT = undefined
    expect(loadAndValidateConfig().isSuccess).toBeFalsy()
    loadAndValidateConfig().iterFailure((e) => {
      expect(e).toBe('"PORT" must be a number')
    })
  })
})
