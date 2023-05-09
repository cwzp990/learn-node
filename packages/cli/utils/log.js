const log = require('npmlog');

log.level =
  process.argv.includes('--debug') || process.argv.includes('-d')
    ? 'verbose'
    : 'info';

log.heading = 'fle-cli';

log.addLevel('success', 2000, { fg: 'green', bold: true });

module.exports = log;
