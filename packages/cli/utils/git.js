import fsextra from "fs-extra";

import GitHub from "../lib/git/github.js";
import Gitee from "../lib/git/gitee.js";
import {
  getGitPlatform,
  getGitOwn,
  getGitLogin,
  createPlatformPath,
  createOwnPath,
  createLoginPath,
} from "../lib/git/GitServer.js";
import { makeList } from "../lib/inquirer/index.js";

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

function savePlatform(platform) {
  fsextra.writeFileSync(createPlatformPath(), platform);
}

function saveOwn(own) {
  fsextra.writeFileSync(createOwnPath(), own);
}

function saveLogin(login) {
  fsextra.writeFileSync(createLoginPath(), login);
}

async function initGitServer() {
  const selectPlatform = () => {
    return makeList({
      choices: PLATFORM,
      message: "请选择代码托管平台",
      defaultValue: "github",
    });
  };

  // 先从本地文件获取 没有取到再让用户选择
  let platform = getGitPlatform() || (await selectPlatform());

  let gitApi = null;
  if (platform === "github") {
    gitApi = new GitHub();
  } else if (this.platform === "gitee") {
    gitApi = new Gitee();
  }

  savePlatform(platform);
  return gitApi;
}

async function getGitLoginHandle(org) {
  if (!org.length) return;

  const orgList = org.map((item) => {
    return {
      name: item.name || item.login,
      value: item.login,
    };
  });

  return await makeList({
    choices: orgList,
    message: "请选择组织",
  });
}

async function getGitOwnHandle() {
  return await makeList({
    choices: [
      {
        name: "个人",
        value: "user",
      },
      {
        name: "组织",
        value: "org",
      },
    ],
    message: "请选择仓库类型",
  });
}

async function initGitType(gitApi) {
  const user = await gitApi.getUser();
  const org = await gitApi.getOrg();

  // 让用户选择仓库类型
  let gitOwn = getGitOwn() || (await getGitOwnHandle());
  let gitLogin = getGitLogin() || (await getGitLoginHandle(org));

  if (gitOwn === "user") {
    gitLogin = user?.login;
  }

  if (!gitOwn || !gitLogin) {
    throw new Error("获取用户信息失败");
  }

  saveLogin(gitLogin);
  saveOwn(gitOwn);
}

export { initGitServer, initGitType };
