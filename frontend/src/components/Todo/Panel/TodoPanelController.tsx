import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import TodoPanelComponent from './TodoPanelComponent';
import { useTodoViewModel } from '../../../view-models/TodoViewModel';
import { todoIdsState } from '../../../state/todos';

function TodoPanelController(): JSX.Element {
  const todoViewModel = useTodoViewModel();
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const data = useRecoilValue(todoIdsState);

  useEffect(() => {
    todoViewModel.fetchAllTodo();
  }, []);

  const addItem = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => {
    todoViewModel.addTodo((e.target as HTMLInputElement).value);
  };

  return (
    <TodoPanelComponent
      data={data}
      newTodoTitle={newTodoTitle}
      setNewTodoTitle={setNewTodoTitle}
      addItem={addItem}
    />
  );
}

export default TodoPanelController;
