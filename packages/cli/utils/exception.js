import { isDebug } from './index.js';
import log from './log.js';

const printErrorLog = (err) => {
  if (isDebug()) {
    log.error('node', err);
  } else {
    log.error('node', err.message);
  }
};

process.on('uncaughtException', printErrorLog);

process.on('unhandledRejection', printErrorLog);
