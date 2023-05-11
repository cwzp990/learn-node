import fsextra from "fs-extra";
import path from "path";
import ora from "ora";
import ejs from "ejs";

import { glob } from "glob";
import { pathExistsSync } from "path-exists";

import log from "../../utils/log.js";

function getCacheFilePath(targetPath, template) {
  const { npmName } = template;
  return path.resolve(targetPath, "node_modules", npmName, "template");
}

function copyFile(targetPath, template, installDir) {
  const originPath = getCacheFilePath(targetPath, template);
  const fileList = fsextra.readdirSync(originPath);

  const spinner = ora("正在拷贝文件...").start();
  fileList.forEach((file) => {
    fsextra.copySync(`${originPath}/${file}`, `${installDir}/${file}`);
  });
  spinner.stop();
  log.success("拷贝文件成功");
}

function ejsRender(installDir, template) {
  const { ignore, value: name } = template;
  glob("**", {
    cwd: installDir,
    nodir: true,
    ignore: [ignore, "**/node_modules/**"],
  }).then((files) => {
    files.forEach((file) => {
      const filePath = path.join(installDir, file);
      ejs.renderFile(filePath, { data: { name } }, (err, result) => {
        if (!err) {
          fsextra.writeFileSync(filePath, result);
        } else {
          throw new Error(err);
        }
      });
    });
  });
}

export default function installTemplate(selectedTemplate, options) {
  const { targetPath, template, name } = selectedTemplate;
  const { force = false } = options;

  const rootDir = process.cwd();
  fsextra.ensureDirSync(targetPath);
  const installDir = path.resolve(`${rootDir}/${name}`);

  if (pathExistsSync(installDir)) {
    if (force) {
      fsextra.removeSync(installDir);
      fsextra.ensureDirSync(installDir);
    } else {
      throw new Error("当前目录已存在同名项目，请重新创建");
    }
  } else {
    fsextra.ensureDirSync(installDir);
  }

  copyFile(targetPath, template, installDir);

  ejsRender(installDir, template);
}
