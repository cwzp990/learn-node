const handleUserRouter = (req, res) => {
  // 登录
  if (req.method === 'POST' && req.path === '/api/user/login') {
    return {
      msg: '这是登录接口'
    }
  }
}

module.exports = handleUserRouter