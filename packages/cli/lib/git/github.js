import { GitServer } from "./GitServer.js";

const BASE_URL = "https://api.github.com";

class GitHub extends GitServer {
  constructor() {
    super();
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
    });
    this.service.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${this.token}`;
        config.headers["Accept"] = "application/vnd.github+json";
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
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
      params,
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