import { Application } from 'ddd-tactical-core-boilerplate';

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
