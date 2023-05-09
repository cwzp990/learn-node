const { program } = require('commander');
const { log } = require('../utils/log');
const createInitCommander = require('./init');

const pkg = require('../package.json');

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

module.exports = main;
