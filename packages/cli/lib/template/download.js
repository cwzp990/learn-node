import path from "path";
import { pathExistsSync } from "path-exists";
import fsextra from "fs-extra";
import ora from "ora";
import { execa } from "execa";

import log from "../../utils/log.js";

function getCacheDir(targetPath) {
  return path.resolve(targetPath, "node_modules");
}

function makeCacheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath);
  // 如果目录不存在 就创建新目录
  if (!pathExistsSync(cacheDir)) {
    fsextra.mkdirpSync(cacheDir);
  }
}

async function downloadAddTemplate(targetPath, selectedTemplate) {
  const { npmName, version } = selectedTemplate;
  const installCommand = "npm";
  const installArgs = ["install", `${npmName}@${version}`];
  const cacheDir = getCacheDir(targetPath);

  // 下载模板
  await execa(installCommand, installArgs, { cwd: cacheDir });
}

export default async function downloadTemplate(selectedTemplate) {
  const { targetPath, template } = selectedTemplate;

  makeCacheDir(targetPath);

  // 下载模板
  const spinner = ora("正在下载模板...").start();

  try {
    await downloadAddTemplate(targetPath, template);
    spinner.stop();
    log.success("模板下载成功");
  } catch (err) {
    spinner.stop();
    log.error("模板下载失败");
  }
}
