import { type JSX, useState } from 'react';
import TodoEntryComponent from './TodoEntryComponent';
import { type Todo } from '../../../models/Todo';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { completeTodo, deleteTodo, modifyTodoTitle, uncompleteTodo, updateTodoTitle } from '../../../features/todo/todoSlice';

interface TodoEntityProps {
  id: string;
}

function TodoEntryController(props: TodoEntityProps): JSX.Element {
  const { id } = props;
  const [editable, setEditable] = useState<string | null>(null);
  const oldTodo = useSelector((state: RootState) => state.todo.todosState.filter((todo: Todo) => todo.id === id)[0])
  const dispatch = useDispatch<AppDispatch>()
  const updateLocalItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('updateLocalItem', e);
    const { value } = e.target;
    dispatch(updateTodoTitle({ id, title: value }))
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleCheckbox', id, e.target.checked);
    if (e.target.checked) {
      dispatch(completeTodo(id))
    } else {
      dispatch(uncompleteTodo(id))
    }
  };

  const modifyTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('modifyTitle', e);
    dispatch(modifyTodoTitle({ id, title: (e.target as HTMLInputElement).value }))
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
        dispatch(deleteTodo(id))
      }}
    />
  );
}

export default TodoEntryController;
