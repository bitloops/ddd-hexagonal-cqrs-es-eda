import React, { ReactNode } from 'react';
import { IamViewModelProvider, IamViewModelProviderProps } from '../view-models/IamViewModel';
import { TodoViewModelProvider } from '../view-models/TodoViewModel';

const ViewModelProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const providers: React.ComponentType<IamViewModelProviderProps>[] = [
    IamViewModelProvider,
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
