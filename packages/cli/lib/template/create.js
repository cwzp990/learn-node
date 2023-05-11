import path from "path";
import { homedir } from "os";

import { getLatestVersion } from "../../utils/npm.js";
import { makeInput, makeList } from "../inquirer/index.js";
import request from "../request/index.js";

const ADD_TYPE = [
  {
    name: "后台管理系统",
    value: "pc",
  },
  {
    name: "移动端",
    value: "mobile",
  },
  {
    name: "微信小程序",
    value: "wechat",
  },
];

const TEMP_HOME = ".fle-cli";

const getAddType = () => {
  return makeList({
    choices: ADD_TYPE,
    message: "请选择需要创建的项目类型",
    defaultValue: "pc",
  });
};

const getAddName = () => {
  return makeInput({
    message: "请输入项目名称",
    validate(v) {
      return v.length ? true : "项目名称不能为空";
    },
  });
};

const getAddTemplate = (templateList) => {
  return makeList({
    choices: templateList,
    message: "请选择需要创建的项目模板",
    defaultValue: "vue",
  });
};

function makeTargetPath() {
  return path.resolve(`${homedir()}/${TEMP_HOME}`, "addTemplate");
}

// 通过api获取模板列表
async function getTemplateList() {
  const data = await request({
    url: "/v1/project",
    method: "get",
  }).catch((err) => {
    throw new Error(err);
  });

  return data;
}

export default async function createTemplate(name, options) {
  // 获取模板列表
  const templateList = await getTemplateList();
  const { type = null, template = null } = options;
  // 获取创建类型
  const addType = type || (await getAddType());
  const addName = name || (await getAddName());
  const addTemplate = template || (await getAddTemplate(templateList));
  const selectedTemplate = templateList.find((_) => _.value === addTemplate);

  if (!selectedTemplate) {
    throw new Error(`项目模板 ${template} 不存在!`);
  }

  // 获取最新版本
  const latestVersion = await getLatestVersion(selectedTemplate.npmName);
  selectedTemplate.version = latestVersion;

  // 安装路径
  const targetPath = makeTargetPath();

  return {
    type: addType,
    name: addName,
    template: selectedTemplate,
    targetPath,
  };
}
