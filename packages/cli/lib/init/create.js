import { program } from 'commander';
import { dirname } from 'dirname-filename-esm';
import path from 'path';
import fsextra from 'fs-extra';
import semver from 'semver';

import log from '../../utils/log.js';

const __dirname = dirname(import.meta);
const pkgPath = path.resolve(__dirname, '../../package.json');
const pkg = fsextra.readJsonSync(pkgPath);

function checkNodeVersion() {
  const pkgVersion = pkg.engines.node.replace(/>|=/g, '');
  if (!semver.gt(process.version, pkgVersion)) {
    throw new Error(
      `当前node版本 ${process.version}，低于 v${pkgVersion}，请升级node版本`,
    );
  }
}

function preAction() {
  // 检查node版本
  checkNodeVersion();
}

export default function createCli() {
  log.success('version', pkg.version);

  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .hook('preAction', preAction);

  program.on('option:debug', () => {
    if (program.opts().debug) {
      log.verbose('debug', '开启调试模式');
    }
  });

  program.on('command:*', (cmds) => {
    log.error('cli', `未知的命令：${cmds.join(' ')}`);
  });

  return program;
}
