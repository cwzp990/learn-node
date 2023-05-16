import fsextra from "fs-extra";
import SimpleGit from "simple-git";
import path from "path";

import Commander from "../commander/index.js";
import log from "../../utils/log.js";
import { initGitServer, initGitType } from "../../utils/git.js";
import { clearCache } from "../../lib/git/GitServer.js";

class CommitCommander extends Commander {
  get command() {
    return "commit";
  }

  get description() {
    return "commit project";
  }

  get options() {
    return [["-c, --clear", "清空缓存", false]];
  }

  async action([name]) {
    const { clear } = name;
    if (clear) {
      clearCache();
      log.success("清空缓存成功");
    }
    await this.createRemoteRepo();
    await this.initLocal();
  }

  async createRemoteRepo() {
    this.gitApi = await initGitServer();
    await this.gitApi.init();
    await initGitType(this.gitApi);
    // 创建远程仓库
    const dir = process.cwd();
    const pkg = fsextra.readJsonSync(path.resolve(dir, "package.json"));
    this.name = pkg.name;
    await this.gitApi.createRemoteRepo(pkg.name);
    // 生产gitignore
    const gitIgnorePath = path.resolve(dir, ".gitignore");
    if (!fsextra.existsSync(gitIgnorePath)) {
      log.info("创建.gitignore文件");
      fsextra.writeFileSync(gitIgnorePath, "node_modules");
      log.info("创建.gitignore文件成功");
    }
  }

  async initLocal() {
    // 生成本地仓库
    const remoteUrl = this.gitApi.getRepoUrl(
      `${this.gitApi.login}/${this.name}`
    );
    this.git = new SimpleGit(process.cwd());

    const gitDir = path.resolve(process.cwd(), ".git");
    if (!fsextra.existsSync(gitDir)) {
      await this.git.init();
      log.suuccess("本地仓库初始化成功");
    }

    const remotes = await this.git.getRemotes();
    if (remotes.find((remote) => remote.name === "origin")) {
      this.git.addRemote("origin", remoteUrl);
      log.success("本地仓库关联远程仓库成功");
    }

    const status = await this.git.status();
    // 拉取分支
    await this.git.pull("origin", "master").catch((err) => {
      log.error("拉取远程仓库失败");
    });
  }
}

function Commit(instance) {
  return new CommitCommander(instance);
}

export default Commit;
