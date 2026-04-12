export const maskDocument = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export const validateCPF = (value) => {
  const d = value.replace(/\D/g, '')
  if (d.length !== 11) return false
  if (/^(\d)\1{10}$/.test(d)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i)
  let rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  if (rem !== parseInt(d[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i)
  rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  return rem === parseInt(d[10])
}

export const validateCNPJ = (value) => {
  const d = value.replace(/\D/g, '')
  if (d.length !== 14) return false
  if (/^(\d)\1{13}$/.test(d)) return false
  const calc = (digits, weights) => {
    const sum = weights.reduce((acc, w, i) => acc + parseInt(digits[i]) * w, 0)
    const rem = sum % 11
    return rem < 2 ? 0 : 11 - rem
  }
  if (calc(d, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) !== parseInt(d[12])) return false
  if (calc(d, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) !== parseInt(d[13])) return false
  return true
}

export const validateDocument = (value) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) return validateCPF(digits)
  if (digits.length === 14) return validateCNPJ(digits)
  return false
}

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

/**
 * Máscara bancária de moeda BRL (constrói a partir dos centavos, estilo PIX).
 * Entrada: qualquer string (pode já estar formatada ou ser só dígitos).
 * Saída: string formatada pt-BR — ex: "154,50", "1.234,56".
 */
export const maskBRL = (input) => {
  const digits = String(input || '').replace(/\D/g, '').slice(0, 9) // max R$9.999.999,99
  if (!digits) return ''
  const num = parseInt(digits, 10) || 0
  return (num / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Converte string de display BRL ("1.234,56") para float (1234.56) para o backend.
 */
export const parseBRL = (value) => {
  return parseFloat(String(value || '0').replace(/\./g, '').replace(',', '.')) || 0
}

/**
 * Converte float vindo do backend (ex: 154.5) para o formato de display ("154,50").
 */
export const initBRL = (value) => {
  if (!value) return ''
  const cents = Math.round(parseFloat(value) * 100)
  if (!cents) return ''
  return maskBRL(String(cents))
}
