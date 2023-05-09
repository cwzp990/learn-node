const Commander = require('../commander');

class InitCommander extends Commander {
  get command() {
    return 'init [name]';
  }

  get description() {
    return 'init project';
  }

  get options() {
    return [['-f, --force', '是否强制初始化项目', false]];
  }

  action([name, options]) {
    console.log('init', name, options);
  }
}

function Init(instance) {
  return new InitCommander(instance);
}

module.exports = Init;
