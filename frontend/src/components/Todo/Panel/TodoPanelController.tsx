import { useState } from 'react';

import TodoPanelComponent from './TodoPanelComponent';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { addTodo } from '../../../features/todo/todoSlice';

function TodoPanelController(): JSX.Element {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const { todoIdsState } = useSelector((state: RootState) => state.todo)
  const dispatch = useDispatch<AppDispatch>()

  const addItem = () => {
    if (newTodoTitle) dispatch(addTodo(newTodoTitle))
    setNewTodoTitle('');
  };

  return (
    <TodoPanelComponent
      data={todoIdsState}
      newTodoTitle={newTodoTitle}
      setNewTodoTitle={setNewTodoTitle}
      addItem={addItem}
    />
  );
}

export default TodoPanelController;
