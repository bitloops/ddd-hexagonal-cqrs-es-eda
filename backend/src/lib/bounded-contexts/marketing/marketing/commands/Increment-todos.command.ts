import { Application } from '@bitloops/bl-boilerplate-core';

export type TIncrementTodosCommand = {
  id: string;
};

export class IncrementTodosCommand extends Application.Command {
  public id: string;

  constructor(props: TIncrementTodosCommand) {
    super('Marketing');
    this.id = props.id;
  }
}
