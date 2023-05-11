class ResponseData {
  constructor(code, message, data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success(data) {
    return new ResponseData(200, "操作成功", data);
  }

  static fail(message) {
    return new ResponseData(500, message, null);
  }
}

module.exports = ResponseData;
