import Commander from "../commander/index.js";
import GitHub from "./github.js";

import { makeList } from "../inquirer/index.js";
import { getGitPlatform } from "./GitServer.js";

const PLATFORM = [
  {
    name: "GitHub",
    value: "github",
  },
  {
    name: "Gitee",
    value: "gitee",
  },
  {
    name: "GitLab",
    value: "gitlab",
  },
];

class InstallCommander extends Commander {
  get command() {
    return "install";
  }

  get description() {
    return "Install a package";
  }

  get options() {}

  async action() {
    // 先从本地文件获取 没有取到再让用户选择
    const platform = getGitPlatform() || (await this.selectPlatform());

    let gitApi;
    if (platform === "github") {
      gitApi = new GitHub();
    } else if (platform === "gitee") {
      gitApi = new Gitee();
    }

    gitApi.savePlatform(platform);
    await gitApi.init();

    // search
    const searchRes = await gitApi.get("/search/repositories", {
      q: "vue+language:javascript",
      order: "desc",
      sort: "stars",
      per_page: 10,
      page: 1,
    });
  }

  selectPlatform() {
    return makeList({
      choices: PLATFORM,
      message: "请选择代码托管平台",
      defaultValue: "github",
    });
  }
}

function Install(instance) {
  return new InstallCommander(instance);
}

export default Install;
