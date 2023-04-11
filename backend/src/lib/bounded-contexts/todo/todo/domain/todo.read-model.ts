export type TTodoReadModelSnapshot = {
  userId: string;
  id: string;
  title: string;
  completed: boolean;
};

export class TodoReadModel {
  public id: string;
  public userId: string;
  public title: string;
  public completed: boolean;

  constructor(public props: TTodoReadModelSnapshot) {
    this.id = props.id;
    this.userId = props.userId;
    this.title = props.title;
    this.completed = props.completed;
  }

  static fromPrimitives(snapshot: TTodoReadModelSnapshot): TodoReadModel {
    return new TodoReadModel(snapshot);
  }
}
