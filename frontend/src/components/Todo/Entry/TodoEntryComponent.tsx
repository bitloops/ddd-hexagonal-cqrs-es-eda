import { Button } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { Tooltip } from '../../ui/Tooltip';

import { type Todo } from '../../../models/Todo';
import './Entry.css';

interface TodoProps {
  todo: Todo;
  editable: string | null;
  setEditable: React.Dispatch<React.SetStateAction<string | null>>;
  updateLocalItem: (d: React.ChangeEvent<HTMLInputElement>) => void;
  modifyTitle: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeItem: (id: string) => void;
  handleCheckbox: (d: React.ChangeEvent<HTMLInputElement>) => void;
}

function TodoEntryComponent(props: TodoProps) {
  const { todo, editable, setEditable, handleCheckbox, modifyTitle, updateLocalItem, removeItem } =
    props;

  const { title, isCompleted } = todo;
  return (
    <li className="todo-list-item">
      <div className="todo_element">
        <Tooltip content={isCompleted ? 'Mark Todo incomplete' : 'Mark Todo complete'}>
          <input
            className="checkbox"
            id={todo.id}
            type="checkbox"
            checked={isCompleted}
            aria-label={isCompleted ? 'Mark Todo incomplete' : 'Mark Todo complete'}
            onChange={handleCheckbox}
          />
        </Tooltip>
        {editable === todo.id ? (
          <input
            type="text"
            value={title}
            id={todo.id}
            className="element_title element_title--editing"
            onChange={updateLocalItem}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditable(null);
                modifyTitle(e);
              }
            }}
          />
        ) : (
          <p
            className={`element_title${isCompleted ? ' element_title--completed' : ''}`}
            id={todo.id}
            tabIndex={0}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              const target = e.target as HTMLParagraphElement;
              setEditable(target.id);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target as HTMLParagraphElement;
                setEditable(target.id);
              }
            }}
          >
            {title}
          </p>
        )}
        <div className="delete_button">
          <Tooltip content="Delete Todo">
            <Button
              aria-label="Delete Todo"
              onClick={() => removeItem(todo.id)}
            >
              <FaTrash aria-hidden="true" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </li>
  );
}

export default TodoEntryComponent;
