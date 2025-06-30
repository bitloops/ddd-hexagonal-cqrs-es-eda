import { useState } from 'react';

import TodoPanelComponent from './TodoPanelComponent';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { addTodo, loadMoreTodos } from '../../../store/todo/todoSlice';

function TodoPanelController(): JSX.Element {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const { todoIdsState } = useSelector((state: RootState) => state.todo)
  const dispatch = useDispatch<AppDispatch>();


  const loadTodos = async () => {
    dispatch(loadMoreTodos({ offset: todoIdsState.length, limit: 5 }));
  };

  const addItem = () => {
    if (newTodoTitle) dispatch(addTodo(newTodoTitle))
    setNewTodoTitle('');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      loadTodos();
    }
    console.log(scrollHeight - scrollTop - clientHeight < 50);

  };

  return (
    <TodoPanelComponent
      data={todoIdsState}
      newTodoTitle={newTodoTitle}
      setNewTodoTitle={setNewTodoTitle}
      addItem={addItem}
      onScroll={handleScroll}
    />
  );
}

export default TodoPanelController;
