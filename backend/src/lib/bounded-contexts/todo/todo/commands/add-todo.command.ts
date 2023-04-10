import { Application } from '@bitloops/bl-boilerplate-core';

export type TAddTodoCommand = {
  title: string;
};

export class AddTodoCommand extends Application.Command {
  public title: string;

  constructor(props: TAddTodoCommand) {
    super('Todo');
    this.title = props.title;
  }
}
