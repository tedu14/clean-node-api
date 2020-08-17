import { EmailValidatorAdapter } from './EmailValidatorAdapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): Boolean {
    return true
  }
}))

describe('EmailValidatorAdapter', () => {
  test('should return a false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@example.com')

    expect(isValid).toBe(false)
  })

  test('should return a true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('email@example.com')

    expect(isValid).toBe(true)
  })
})
