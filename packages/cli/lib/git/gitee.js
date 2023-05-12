import axios from "axios";
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
    return this.service({
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
    return this.service({
      url,
      data: params,
      methods: "post",
      headers,
    });
  }

  searchRepositories(params) {
    return this.get("/search/repositories", params);
  }
}

export default GitHub;
