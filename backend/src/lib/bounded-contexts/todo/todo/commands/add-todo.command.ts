import { Application } from 'ddd-tactical-core-boilerplate';

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
