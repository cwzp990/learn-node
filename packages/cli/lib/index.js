import createInitCommander from './init/index.js';
import '../utils/exception.js';
import createCli from './init/create.js';

function main(args) {
  const program = createCli();

  createInitCommander(program);

  program.parse(process.argv);
}

export default main;
