export const maskPhone = (value) => {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) {
    // (11) 9999-9999
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14)
  }
  // (11) 99999-9999
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

export const unmaskPhone = (value) => {
  if (!value) return ''
  return value.replace(/\D/g, '')
}
