/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { HStack, IconButton, Spacer, Tooltip } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

import Todo from '../../../models/Todo';
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

const buttonProps = {
  icon: <FaTrash />,
  isRound: true,
  'aria-label': 'delete',
};

function TodoEntryComponent(props: TodoProps): JSX.Element {
  const { todo, editable, setEditable, handleCheckbox, modifyTitle, updateLocalItem, removeItem } =
    props;

  const { title, isCompleted } = todo;
  return (
    <li key={todo.id}>
      <HStack key={todo.id}>
        <div className="todo_element">
          <Tooltip label={todo.isCompleted ? 'Uncomplete Todo' : 'Complete Todo'}>
            <input
              className="checkbox"
              id={todo.id}
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => handleCheckbox(e)}
            />
          </Tooltip>
          {editable === todo.id ? (
            <input
              type="title"
              value={title}
              id={todo.id}
              className="element_title"
              onChange={(e) => updateLocalItem(e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditable(null);
                  modifyTitle(e);
                }
              }}
              onBlur={() => modifyTitle}
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <p
              className="element_title"
              id={todo.id}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
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
          <Spacer />
          <Tooltip label="Delete Todo">
            <IconButton
              className="delete_button"
              onClick={() => {
                removeItem(todo.id);
              }}
              {...buttonProps}
            />
          </Tooltip>
        </div>
      </HStack>
    </li>
  );
}

export default TodoEntryComponent;
