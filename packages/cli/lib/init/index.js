import Commander from '../commander/index.js';
import log from '../../utils/log.js';
import createTemplate from '../template/create.js';
import downloadTemplate from '../template/download.js';
import installTemplate from '../template/install.js';

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

  async action([name, options]) {
    log.info('init', name, options);
    // 选择模板，创建项目
    const selectedTemplate = await createTemplate(name, options);
    // 下载模板
    await downloadTemplate(selectedTemplate);
    // 安装拷贝模版
    installTemplate(selectedTemplate, options);
  }
}

function Init(instance) {
  return new InitCommander(instance);
}

export default Init;
