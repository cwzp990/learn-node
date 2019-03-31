const loginUser = (username, password) => {
  if (username === 'juzi' && password === '123') {
    return true
  }
  return false
}

module.exports = loginUser