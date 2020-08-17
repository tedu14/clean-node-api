import { EmailValidatorAdapter } from './EmailValidatorAdapter'

describe('EmailValidatorAdapter', () => {
  test('should return a false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('invalid_email@example.com')

    expect(isValid).toBe(false)
  })
})
