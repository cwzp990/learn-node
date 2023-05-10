import Commander from '../commander/index.js';
import log from '../../utils/log.js';
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
    log.info('init', name, options);
  }
}

function Init(instance) {
  return new InitCommander(instance);
}

export default Init;
