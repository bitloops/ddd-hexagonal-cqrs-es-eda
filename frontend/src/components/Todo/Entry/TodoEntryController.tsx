import React from 'react';
import { useRecoilState } from 'recoil';
import TodoEntryComponent from './TodoEntryComponent';
import { useTodoViewModel } from '../../../view-models/TodoViewModel';
import { Todo, todosState } from '../../../state/todos';

interface TodoEntityProps {
  id: string;
}

function TodoEntryController(props: TodoEntityProps): JSX.Element {
  const { id } = props;
  const [editable, setEditable] = React.useState<string | null>(null);
  const [todo, setTodo] = useRecoilState<Todo>(todosState(id));
  const todoViewModel = useTodoViewModel();

  const updateLocalItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('updateLocalItem', e);
    const { value } = e.target;
    const newData: Todo = { ...todo, title: value };
    setTodo(newData);
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleCheckbox', id, e.target.checked);
    if (e.target.checked) {
      todoViewModel.completeTodo(id);
    } else {
      todoViewModel.uncompleteTodo(id);
    }
  };

  const modifyTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('modifyTitle', e);
    todoViewModel.modifyTitle(id, (e.target as HTMLInputElement).value);
  };

  return (
    <TodoEntryComponent
      updateLocalItem={updateLocalItem}
      todo={todo}
      editable={editable}
      setEditable={setEditable}
      handleCheckbox={handleCheckbox}
      modifyTitle={modifyTitle}
      // updateLocalItem={(e) => {
      //   todoViewModel.updateLocalItem(id, e);
      // }}
      removeItem={() => {
        todoViewModel.deleteTodo(id);
      }}
    />
  );
}

export default TodoEntryController;
