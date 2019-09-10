type TValidator<A> = (_: A) => string | undefined

export const composeValidators = (
  ...validators: TValidator<any>[]
): TValidator<unknown> => value => {
  for (const validator of validators) {
    const validationResult = validator(value)
    if (validationResult) return validationResult
  }
}

export const emailValidator: TValidator<string> = value =>
  /.+@.+/.test(value) ? undefined : 'Email address not valid'

export const passwordValidator: TValidator<string> = value => {
  if (value.length < 8) return 'Password must be at least 8 characters long'
  if (value.toLowerCase() === value)
    return 'Password must have at least one uppercase letter'
  if (value.toUpperCase() === value)
    return 'Password must have at least one lowercase letter'
  if (!/\d/g.test(value)) return 'Password must contain at least one number'
}

export const requiredValidator: TValidator<unknown> = value =>
  value ? undefined : 'Required'
