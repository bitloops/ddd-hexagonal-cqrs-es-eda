import React, { type ReactNode } from 'react';
import { TodoViewModelProvider, type TodoViewModelProviderProps } from '../view-models/TodoViewModel';

const ViewModelProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const providers: React.ComponentType<TodoViewModelProviderProps>[] = [
    TodoViewModelProvider,
    // Add more View Model Providers here
  ];
  return (
    <>
      {providers.reduceRight(
        (child, Provider) => (
          <Provider>{child}</Provider>
        ),
        children
      )}
    </>
  );
};

export default ViewModelProviders;
