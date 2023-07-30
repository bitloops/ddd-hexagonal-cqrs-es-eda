import React from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/react';
import logo from '../../../assets/bitloops_175x40_transparent.png';
import TodoElement from '../Entry';
import './Panel.css';

interface TodoProps {
  data: string[];
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  addItem: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>) => void;
}

function TodoPanel(props: TodoProps): JSX.Element {
  const { data, newTodoTitle, setNewTodoTitle, addItem } = props;

  return (
    <div className="container">
      <div className="heading">
        <img src={logo} alt="Bitloops" className="logo" />
        <h1 className="title">To Do</h1>
      </div>
      <input
        type="text"
        value={newTodoTitle}
        className="todo-list-input"
        onChange={(e) => {
          setNewTodoTitle(e.target.value);
        }}
        onKeyDown={(e) => e.key === 'Enter' && addItem(e)}
      />
      <button onClick={addItem} type="button">
        <Tooltip label="Add Todo">
          <AddIcon />
        </Tooltip>
      </button>

      <div className="todo-list">
        <ul>{data && data.map((id) => <TodoElement key={id} id={id} />)}</ul>
      </div>
    </div>
  );
}

export default TodoPanel;
