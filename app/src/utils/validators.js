exports.validateUsername = (str) => {
  // Between 2-10 characters: uppercase, lowercase and digits
  const regex = /^[A-Z\d\-_]{2,10}$/
  return str.toUpperCase().trim().match(regex)
}

exports.validatePassword = (str) => {
  // Between 5-10 characters: 1 upper, 1 lower, 1 digit, 1 special
  const regex = 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,10}$/
  return str.match(regex)
}