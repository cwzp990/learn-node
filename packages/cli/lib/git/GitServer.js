import path from "path";
import fsextra from "fs-extra";
import { homedir } from "os";
import { pathExistsSync } from "path-exists";

import { makePassword } from "../inquirer/index.js";

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
}

export { GitServer, getGitPlatform };
