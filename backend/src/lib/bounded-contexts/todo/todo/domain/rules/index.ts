import { TitleOutOfBoundsRule } from './TitleOutOfBoundsRule';
import { TodoAlreadyCompletedRule } from './TodoAlreadyCompletedRule';
import { TodoAlreadyUncompletedRule } from './TodoAlreadyUncompletedRule';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Rules {
  export class TitleOutOfBounds extends TitleOutOfBoundsRule {}
  export class TodoAlreadyCompleted extends TodoAlreadyCompletedRule {}
  export class TodoAlreadyUncompleted extends TodoAlreadyUncompletedRule {}
}
