#! /usr/bin/env node

const importLocal = require('import-local');
const entry = require('../lib/index.js');
const { log } = require('../utils/log.js');

if (importLocal(__filename)) {
  log.info('cli', '正在使用 cli 本地版本');
} else {
  entry(process.argv.slice(2));
}
