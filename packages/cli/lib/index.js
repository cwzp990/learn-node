import createCli from "./init/create.js";
import createInitCommander from "./init/index.js";
import createInstallCommander from "./git/install.js";

import "../utils/exception.js";

function main(args) {
  const program = createCli();

  createInitCommander(program);

  createInstallCommander(program);

  program.parse(process.argv);
}

export default main;
