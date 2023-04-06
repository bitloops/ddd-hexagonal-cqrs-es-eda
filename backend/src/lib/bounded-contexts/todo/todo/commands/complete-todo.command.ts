import { Application } from '@bitloops/bl-boilerplate-core';

export type TCompleteTodoCommand = {
  todoId: string;
};

export class CompleteTodoCommand extends Application.Command {
  public id: string;

  constructor(props: TCompleteTodoCommand) {
    super('Todo');
    this.id = props.todoId;
  }
}
