#! /usr/bin/env node

import importLocal from 'import-local';
import { filename } from 'dirname-filename-esm';

const __filename = filename(import.meta);

import entry from '../lib/index.js';
import { log } from '../utils/log.js';

if (importLocal(__filename)) {
  log.info('cli', '正在使用 cli 本地版本');
} else {
  entry(process.argv.slice(2));
}
