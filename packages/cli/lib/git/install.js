import ora from "ora";
import Commander from "../commander/index.js";
import GitHub from "./github.js";
import log from "../../utils/log.js";

import { makeInput, makeList } from "../inquirer/index.js";
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
    await this.generateGitApi();
    await this.searchGitApi();
    await this.selectTags();
    await this.downloadRepo();
  }

  selectPlatform() {
    return makeList({
      choices: PLATFORM,
      message: "请选择代码托管平台",
      defaultValue: "github",
    });
  }

  async generateGitApi() {
    // 先从本地文件获取 没有取到再让用户选择
    this.platform = getGitPlatform() || (await this.selectPlatform());

    if (this.platform === "github") {
      this.gitApi = new GitHub();
    } else if (this.platform === "gitee") {
      this.gitApi = new Gitee();
    }

    this.gitApi.savePlatform(this.platform);
    await this.gitApi.init();
  }

  async searchGitApi() {
    // 收集搜索关键词
    this.key = await makeInput({
      message: "请输入搜索关键词",
      validate(v) {
        return v.length ? true : "搜索关键词不能为空";
      },
    });
    this.language = await makeInput({
      message: "请输入开发语言",
    });
    await this.doSearch();
  }

  async selectTags() {
    this.tagPage = 1;
    this.tagPageSize = 30;
    if (this.platform === "github") {
      await this.doSelect();
    }
  }

  async downloadRepo() {
    const spinner = ora(
      `正在下载 ${this.selectedRepo} / ${this.selectedTag}...`
    ).start();
    await this.gitApi.cloneRepo(
      this.selectedRepo,
      this.selectedTag,
      this.platform
    );
    spinner.stop();
    log.success(`${this.selectedRepo} 下载成功`);
  }

  async doSearch() {
    let params = {};
    if (this.platform === "github") {
      params = {
        q: this.language ? `${this.key}+language:${this.language}` : this.key,
        order: "desc",
        sort: "stars",
        per_page: this.pageSize,
        page: this.page,
      };
    }
    const data = await this.gitApi.searchRepositories(params);
    this.count = data.total_count;
    const list = data.items.map((item) => ({
      name: item.full_name,
      value: item.full_name,
    }));

    // 翻页
    if (this.page * this.pageSize < this.count) {
      list.push({
        name: "下一页",
        value: "next",
      });
    }
    if (this.page > 1) {
      list.unshift({
        name: "上一页",
        value: "prev",
      });
    }
    const selectedRepo = await makeList({
      choices: list,
      message: `请选择要下载安装的项目（共${this.count}条）`,
    });

    if (selectedRepo === "next") {
      this.page++;
      await this.doSearch();
    } else if (selectedRepo === "prev") {
      this.page--;
      await this.doSearch();
    } else {
      this.selectedRepo = selectedRepo;
    }
  }

  async doSelect() {
    const params = {
      page: this.tagPage,
      per_page: this.tagPageSize,
    };
    const data = await this.gitApi.getTags(this.selectedRepo, params);
    const list = data.map((item) => ({
      name: item.name,
      value: item.name,
    }));

    // 翻页
    if (list.length) {
      list.push({
        name: "下一页",
        value: "next",
      });
    }
    if (this.tagPage > 1) {
      list.unshift({
        name: "上一页",
        value: "prev",
      });
    }

    const selectedTag = await makeList({
      choices: list,
      message: "请选择要下载安装的版本",
    });
    if (selectedTag === "next") {
      this.tagPage++;
      await this.doSelect();
    } else if (selectedTag === "prev") {
      this.tagPage--;
      await this.doSelect();
    } else {
      this.selectedTag = selectedTag;
    }
  }
}

function Install(instance) {
  return new InstallCommander(instance);
}

export default Install;
