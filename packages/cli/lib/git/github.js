import axios from "axios";
import log from "../../utils/log.js";
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

  getRepo(owner, repo) {
    return this.get(`/repos/${owner}/${repo}`);
  }

  async createRemoteRepo(name) {
    const gitOwn = getGitOwn();
    const gitLogin = getGitLogin();

    const repo = await this.getRepo(gitLogin, name);

    if (repo) {
      log.info("仓库已存在");
      return repo;
    }

    if (gitOwn === "user") {
      return this.post("/user/repos", {
        name,
      });
    }

    if (gitOwn === "org") {
      return this.post(`/orgs/${gitLogin}/repos`, {
        name,
      });
    }
  }
}

export default GitHub;
