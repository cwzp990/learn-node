import { ESLint } from "eslint";
// import { execa } from "execa";
// import ora from "ora";

import Commander from "../commander/index.js";
import log from "../../utils/log.js";
import baseConfig from "./baseConfig.js";

class LintCommander extends Commander {
  get command() {
    return "lint";
  }

  get description() {
    return "lint project";
  }

  get options() {
    return [];
  }

  async action() {
    log.info("lint");
    // eslint 校验 安装依赖 执行校验
    // await execa('npm', ["install", '-D', 'eslint-plugin-vue'])
    const cwd = process.cwd();
    const eslint = new ESLint({ cwd, overrideConfig: baseConfig });
    const results = await eslint.lintFiles(["**/*.{js,jsx,ts,tsx}"]);
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);
  }
}

function Lint(instance) {
  return new LintCommander(instance);
}

export default Lint;
