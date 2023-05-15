import axios from "axios";
import { getGitLogin, getGitOwn, GitServer } from "./GitServer.js";

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
    return this.service({
      url,
      params,
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

  getTags(fullname, params) {
    return this.get(`/repos/${fullname}/tags`, params);
  }

  getUser() {
    return this.get("/user");
  }

  getOrg() {
    return this.get("/user/orgs");
  }

  createRepo(name) {
    const gitOwn = getGitOwn();

    if (gitOwn === "user") {
      return this.post("/user/repos", {
        name,
      });
    }

    if (gitOwn === "org") {
      const gitLogin = getGitLogin();
      return this.post(`/orgs/${gitLogin}/repos`, {
        name,
      });
    }
  }
}

export default GitHub;
