import { Application } from '@bitloops/bl-boilerplate-core';

export type TCompleteTodoCommand = {
  todoId: string;
};

export class CompleteTodoCommand extends Application.Command {
  public id: string;

  constructor(
    props: TCompleteTodoCommand,
    metadata?: Partial<Application.TCommandMetadata>,
  ) {
    super('Todo', metadata);
    this.id = props.todoId;
  }
}
