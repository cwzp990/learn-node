import path from "path";
import fsextra from "fs-extra";
import { homedir } from "os";
import { pathExistsSync } from "path-exists";
import { execa } from "execa";

import log from "../../utils/log.js";
import { makePassword } from "../inquirer/index.js";

const TEMP_HOME = ".fle-cli";
const TEMP_TOKEN = ".token";
const TEMP_PLATFORM = ".git_platform";
const TEMP_OWN = ".git_own";
const TEMP_Login = ".git_login";

function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN);
}

function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM);
}

function createOwnPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_OWN);
}

function createLoginPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_Login);
}

function getGitPlatform() {
  if (pathExistsSync(createPlatformPath())) {
    return fsextra.readFileSync(createPlatformPath(), "utf-8").toString();
  }

  return null;
}

function getGitOwn() {
  if (pathExistsSync(createOwnPath())) {
    return fsextra.readFileSync(createOwnPath(), "utf-8").toString();
  }

  return null;
}

function getGitLogin() {
  if (pathExistsSync(createLoginPath())) {
    return fsextra.readFileSync(createLoginPath(), "utf-8").toString();
  }

  return null;
}

function clearCache() {
  const platform = createPlatformPath();
  const token = createTokenPath();
  const own = createOwnPath();
  const login = createLoginPath();
  fsextra.removeSync(platform);
  fsextra.removeSync(token);
  fsextra.removeSync(own);
  fsextra.removeSync(login);
}

class GitServer {
  constructor() {}

  async init() {
    // 检查token
    const tokenPath = createTokenPath();

    if (pathExistsSync(tokenPath) && fsextra.statSync(tokenPath).size) {
      this.token = fsextra.readFileSync(tokenPath, "utf-8").toString();
    } else {
      // 录入token
      const token = await this.getToken();
      fsextra.writeFileSync(tokenPath, token);
      this.token = token;
    }
  }

  getToken() {
    return makePassword({
      message: "请输入git token",
      validate(v) {
        return v.length ? true : "token不能为空";
      },
    });
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
      return execa("git", ["clone", this.getRepoUrl(platform, repo)]);
    }
  }

  installDependencies(cwd, fullname) {
    const projectPath = this.getProjectPath(cwd, fullname);

    if (pathExistsSync(projectPath)) {
      return execa(
        "npm",
        ["install", "--registry=https://registry.npmmirror.com"],
        {
          cwd: projectPath,
        }
      );
    }
  }

  runRepo(cwd, fullname) {
    const projectPath = this.getProjectPath(cwd, fullname);

    const content = this.getPkgContent(projectPath);
    if (content) {
      const { scripts } = content;
      if (scripts && scripts.dev) {
        return execa("npm", ["run", "dev"], {
          cwd: projectPath,
          stdout: "inherit",
        });
      } else {
        log.warn("未找到scripts.dev命令");
      }
    }
  }

  getPkgContent(projectPath) {
    const pkgPath = path.resolve(projectPath, "package.json");

    if (pathExistsSync(pkgPath)) {
      return fsextra.readJSONSync(pkgPath);
    }
    return null;
  }

  getProjectPath(cwd, fullname) {
    const projectName = fullname.split("/")[1];
    const projectPath = path.resolve(cwd, projectName);

    return projectPath;
  }
}

export {
  GitServer,
  clearCache,
  createTokenPath,
  createPlatformPath,
  createLoginPath,
  createOwnPath,
  getGitPlatform,
  getGitLogin,
  getGitOwn,
};
