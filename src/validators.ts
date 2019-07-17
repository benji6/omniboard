type TValidator<A> = (_: A) => string | undefined

export const requiredValidator: TValidator<unknown> = value =>
  value ? undefined : 'Required'
