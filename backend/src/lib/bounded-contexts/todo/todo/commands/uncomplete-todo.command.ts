import { Application } from '@bitloops/bl-boilerplate-core';

export type TUncompleteTodoCommand = {
  id: string;
};

export class UncompleteTodoCommand extends Application.Command {
  public id: string;

  constructor(props: TUncompleteTodoCommand) {
    super('Todo');
    this.id = props.id;
  }
}
