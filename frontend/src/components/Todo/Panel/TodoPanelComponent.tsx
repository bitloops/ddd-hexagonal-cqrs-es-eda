/* eslint-disable react/jsx-props-no-spreading */
import { type JSX } from 'react';
import { Button, HStack, Input, VStack } from '@chakra-ui/react';
import { Tooltip } from '../../ui/Tooltip';

import logo from '../../../assets/bitloops_175x40_transparent.png';
import TodoElement from '../Entry';
import './Panel.css';

interface TodoProps {
  data: string[];
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  addItem: () => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const vStackProps = {
  p: '4',
  w: '100%',
  maxW: { base: '90vw', sm: '80vw', lg: '50vw', xl: '40vw' },
  borderColor: 'gray.100',
  borderWidth: '2px',
  borderRadius: 'lg',
  alignItems: 'stretch',
};

function TodoPanel(props: TodoProps): JSX.Element {
  const { data, newTodoTitle, setNewTodoTitle, addItem, onScroll } = props;

  return (
    <div className="container">
      <VStack {...vStackProps}>
        <div className="heading">
          <img src={logo} alt="Bitloops" className="logo" />
          <h1 className="title">To Do</h1>
        </div>
        {/* Form submit that doesn't reload the page */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addItem();
          }}
        >
          <HStack m="8">
            <Input
              variant="subtle"
              placeholder="Add your new todo here..."
              value={newTodoTitle}
              onChange={(e) => {
                setNewTodoTitle((e.target as HTMLInputElement).value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <Tooltip content="Add Todo">
              <Button type="submit" colorScheme="green" px="8">
                Add Todo
              </Button>
            </Tooltip>
          </HStack>
        </form>
        <div
          className="todo-list"
          style={{ height: 300, overflowY: 'auto' }}
          onScroll={onScroll}
        >
          <ul>
            {data && data.map((id) => <TodoElement key={id} id={id} />)}
          </ul>
        </div>
      </VStack>
    </div>
  );
}

export default TodoPanel;
