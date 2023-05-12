import { GitServer } from "./GitServer.js";

const BASE_URL = "https://gitee.com/api/v5";

class GitHub extends GitServer {
  constructor() {
    super();
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
    });
    this.service.interceptors.response.use(
      (res) => {
        return res.data;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }

  get(url, params, headers) {
    return this.service.get({
      url,
      params: {
        ...params,
        access_token: this.token,
      },
      methods: "get",
      headers,
    });
  }

  post(url, params, headers) {
    return this.service.post({
      url,
      data: params,
      methods: "post",
      headers,
    });
  }
}

export default GitHub;
