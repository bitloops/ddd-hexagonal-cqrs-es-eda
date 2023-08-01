import React, { useEffect, useState } from 'react';

import TodoPanelComponent from './TodoPanelComponent';
import { useTodoViewModel } from '../../../view-models/TodoViewModel';

function TodoPanelController(): JSX.Element {
  const todoViewModel = useTodoViewModel();
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const { useTodoSelectors } = useTodoViewModel();
  const { todoIds } = useTodoSelectors();

  useEffect(() => {
    todoViewModel.fetchAllTodo();
  }, []);

  const addItem = () => {
    if (newTodoTitle) todoViewModel.addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <TodoPanelComponent
      data={todoIds}
      newTodoTitle={newTodoTitle}
      setNewTodoTitle={setNewTodoTitle}
      addItem={addItem}
    />
  );
}

export default TodoPanelController;
