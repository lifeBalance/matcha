export function validateUsername(str) {
  // Between 2-11 characters: uppercase, lowercase and digits
  const regex = /^[A-Z\d\-_]{2,11}$/
  return str.toUpperCase().trim().match(regex)
}

export function validatePassword(str) {
  // Between 5-10 characters: 1 upper, 1 lower, 1 digit, 1 special
  const regex = 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,10}$/
  return str.match(regex)
}

export function validateName(str) {
  // Between 2-30 characters, uppercase or lowercase (including accents and shit)
  const regex = /^[A-ZÀ-ÚÄ-Ü\s]{2,30}$/
  return str.toUpperCase().trim().match(regex)
}

export function validateEmail(str) {
  const regex = 
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return str.match(regex)
}

export function validateAge(str) {
  if (!str) return false
  const num = parseInt(str)
  return num >= 18 && num <= 100
}
