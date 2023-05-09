const { program } = require('commander');
const pkg = require('../package.json');

const createInitCommander = require('./init');

function main(args) {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false);

  createInitCommander(program);

  program.parse(process.argv);
}

module.exports = main;
