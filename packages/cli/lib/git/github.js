import axios from "axios";
import { execa } from "execa";
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

  getRepoUrl(platform = "github", repo) {
    return `https://${platform}.com/${repo}.git`;
  }

  cloneRepo(repo, tag, platform) {
    if (tag) {
      return execa("git", [
        "clone",
        this.getRepoUrl(platform, repo),
        "-b",
        tag,
      ]);
    } else {
      return execa("git ", ["clone", this.getRepoUrl(platform, repo)]);
    }
  }
}

export default GitHub;
