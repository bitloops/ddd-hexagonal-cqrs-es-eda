import React from 'react';
import TodoEntryComponent from './TodoEntryComponent';
import { useTodoViewModel } from '../../../view-models/TodoViewModel';
import Todo from '../../../models/Todo';

interface TodoEntityProps {
  id: string;
}

function TodoEntryController(props: TodoEntityProps): JSX.Element {
  const { id } = props;
  const { setTodo, useTodoSelectors } = useTodoViewModel();
  const { useTodo } = useTodoSelectors();
  const [editable, setEditable] = React.useState<string | null>(null);
  const todoViewModel = useTodoViewModel();
  const oldTodo = useTodo(id);

  const updateLocalItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('updateLocalItem', e);
    const { value } = e.target;
    const newData: Todo = { ...oldTodo, title: value };
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
      todo={oldTodo}
      editable={editable}
      setEditable={setEditable}
      handleCheckbox={handleCheckbox}
      modifyTitle={modifyTitle}
      removeItem={() => {
        todoViewModel.deleteTodo(id);
      }}
    />
  );
}

export default TodoEntryController;
