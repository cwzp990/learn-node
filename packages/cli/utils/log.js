import log from 'npmlog';
import { isDebug } from './index.js';

log.level = isDebug() ? 'verbose' : 'info';

log.heading = 'fle-cli';

log.addLevel('success', 2000, { fg: 'green', bold: true });

export default log;
