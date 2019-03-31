// 构建一个服务端成功失败模型

class BaseModule {
  constructor(data, msg) {
    if (typeof data === 'string') {
      this.msg = data
      data = null
      msg = null
    }
    if (data) this.data = data
    if (msg) this.msg = msg
  }
}

class SuccessModule extends BaseModule {
  constructor(data, msg) {
    super(data, msg)
    this.errno = 0
  }
}

class ErrorModule extends BaseModule {
  constructor(data, msg) {
    super(data, msg)
    this.errno = -1
  }
}

module.exports = {
  SuccessModule,
  ErrorModule
}