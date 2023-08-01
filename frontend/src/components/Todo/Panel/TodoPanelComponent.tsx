/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Button, HStack, Input, StackDivider, Tooltip, VStack } from '@chakra-ui/react';

import logo from '../../../assets/bitloops_175x40_transparent.png';
import TodoElement from '../Entry';
import './Panel.css';

interface TodoProps {
  data: string[];
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  addItem: () => void;
}

const vStackProps = {
  p: '4',
  w: '100%',
  maxW: { base: '90vw', sm: '80vw', lg: '50vw', xl: '40vw' },
  borderColor: 'gray.100',
  borderWidth: '2px',
  borderRadius: 'lg',
  alignItems: 'stretch',
  divider: <StackDivider />,
};

function TodoPanel(props: TodoProps): JSX.Element {
  const { data, newTodoTitle, setNewTodoTitle, addItem } = props;

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
              variant="filled"
              placeholder="Add your new todo here..."
              value={newTodoTitle}
              onChange={(e) => {
                setNewTodoTitle((e.target as HTMLInputElement).value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <Tooltip label="Add Todo">
              <Button type="submit" colorScheme="green" px="8">
                Add Todo
              </Button>
            </Tooltip>
          </HStack>
        </form>
        <div className="todo-list">
          <ul>{data && data.map((id) => <TodoElement key={id} id={id} />)}</ul>
        </div>
      </VStack>
    </div>
  );
}

export default TodoPanel;
