import { Application, Domain } from '@bitloops/bl-boilerplate-core';
import { asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

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
