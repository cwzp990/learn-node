import { program } from 'commander';
import { dirname } from 'dirname-filename-esm';
import path from 'path';
import fsextra from 'fs-extra';

import createInitCommander from './init/index.js';
import { log } from '../utils/log.js';

const __dirname = dirname(import.meta);
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = fsextra.readJsonSync(pkgPath);

function main(args) {
  log.success('version', pkg.version);

  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false);

  createInitCommander(program);

  program.parse(process.argv);
}

export default main;
