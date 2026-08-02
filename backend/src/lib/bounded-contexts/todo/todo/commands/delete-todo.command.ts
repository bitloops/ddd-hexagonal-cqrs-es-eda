import { Application, Domain } from 'ddd-tactical-core-boilerplate';
import { asyncLocalStorage } from 'ddd-tactical-core-boilerplate';

export type TDeleteTodoCommand = {
  id: string;
};

export class DeleteTodoCommand extends Application.Command {
  public id: string;

  constructor(props: TDeleteTodoCommand) {
    super('Todo');
    this.id = props.id;
  }
}
