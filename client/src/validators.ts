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

export const passwordValidator: TValidator<string> = value =>
  value.length < 8 ? 'Must be at least 8 characters long' : undefined

export const requiredValidator: TValidator<unknown> = value =>
  value ? undefined : 'Required'
