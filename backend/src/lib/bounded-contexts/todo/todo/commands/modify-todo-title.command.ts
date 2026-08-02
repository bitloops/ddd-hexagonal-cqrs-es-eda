import { Application } from 'ddd-tactical-core-boilerplate';
export type TModifyTodoTitleCommand = {
  id: string;
  title: string;
};
export class ModifyTodoTitleCommand extends Application.Command {
  public readonly id: string;
  public readonly title: string;

  constructor(modifyTitleTodo: TModifyTodoTitleCommand) {
    super('Todo');
    this.id = modifyTitleTodo.id;
    this.title = modifyTitleTodo.title;
  }
}
