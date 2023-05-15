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
    this.createRemoteRepo();
  }

  async createRemoteRepo() {
    this.gitApi = await initGitServer();
    await this.gitApi.init();
    await initGitType(this.gitApi);
  }
}

function Commit(instance) {
  return new CommitCommander(instance);
}

export default Commit;
