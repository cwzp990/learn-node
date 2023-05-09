class Commander {
  constructor(instance) {
    if (!instance) {
      throw new Error('Commander: instance is required');
    }

    this.program = instance;

    const cmd = this.program.command(this.command);

    cmd.description(this.description);

    cmd.hook('preAction', () => {
      this.preAction();
    });

    cmd.hook('postAction', () => {
      this.postAction();
    });

    if (this.options?.length) {
      this.options.forEach((option) => {
        cmd.option(...option);
      });
    }

    cmd.action((...params) => {
      this.action(params);
    });
  }

  get command() {
    throw new Error('Commander: command must be override');
  }

  get description() {
    throw new Error('Commander: description must be override');
  }

  get options() {
    return [];
  }

  get action() {
    throw new Error('Commander: action must be override');
  }

  preAction() {}

  postAction() {}
}

module.exports = Commander;
