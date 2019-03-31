const { loginUser } = require('../controller/user')
const { SuccessModule, ErrorModule } = require('../module/resModule')

const handleUserRouter = (req, res) => {
  // 登录
  if (req.method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body
    const data = loginUser(username, password)
    if (data) {
      return new SuccessModule('登陆成功')
    } else {
      return new ErrorModule('登陆失败')
    }
  }
}

module.exports = handleUserRouter
