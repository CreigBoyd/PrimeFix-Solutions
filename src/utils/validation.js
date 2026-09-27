// Small, dependency-free validators shared by the contact form and the
// newsletter signup.

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidPhone(value) {
  // Accepts any formatting (dashes, spaces, parens, +country code) as long
  // as there are at least 10 digits underneath.
  return value.replace(/\D/g, '').length >= 10
}
