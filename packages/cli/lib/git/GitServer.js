import path from "path";
import fsextra from "fs-extra";
import { homedir } from "os";
import { pathExistsSync } from "path-exists";
import { execa } from "execa";

import { makePassword } from "../inquirer/index.js";
import log from "../../utils/log.js";

const TEMP_HOME = ".fle-cli";
const TEMP_TOKEN = ".token";
const TEMP_PLATFORM = ".git_platform";

function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN);
}

function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM);
}

function getGitPlatform() {
  if (pathExistsSync(createPlatformPath())) {
    return fsextra.readFileSync(createPlatformPath(), "utf-8").toString();
  }

  return null;
}

class GitServer {
  constructor() {}

  init() {
    // 检查token
    const tokenPath = createTokenPath();

    if (pathExistsSync(tokenPath)) {
      this.token = fsextra.readFileSync(tokenPath, "utf-8").toString();
    } else {
      // 录入token
      this.getToken().then((token) => {
        fsextra.writeFileSync(tokenPath, token);
        this.token = token;
      });
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

  savePlatform(platform) {
    fsextra.writeFileSync(createPlatformPath(), platform);
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

export { GitServer, getGitPlatform };
