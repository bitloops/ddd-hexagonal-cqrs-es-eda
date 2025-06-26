import React, { type ReactNode, createContext, useContext } from 'react';
import IamService from '../infra/services/IamService';
import { type IIamRepository } from '../infra/interfaces/IIamRepository';
import { type ITodoRepository } from '../infra/interfaces/ITodoRepository';
import IamRepository from '../infra/repositories/iam';
import TodoRepository from '../infra/repositories/todo';

export interface AppContext {
  iamRepository: IIamRepository;
  todoRepository: ITodoRepository;
}

const iamService = new IamService();
const iamRepository = new IamRepository(iamService);
const todoRepository = new TodoRepository();

export const initialContext: AppContext = {
  iamRepository,
  todoRepository,
};

interface DIProviderProps {
  children: ReactNode;
}

export const DIContext = createContext<AppContext>(initialContext);

const DIProvider: React.FC<DIProviderProps> = ({ children }) => (
  <DIContext.Provider value={initialContext}>{children}</DIContext.Provider>
);

function useDIContext() {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useDIContext must be used within an DIProvider');
  }
  return context;
}

function useIamRepository() {
  return useDIContext().iamRepository;
}

function useTodoRepository() {
  return useDIContext().todoRepository;
}

export { useDIContext, DIProvider, useIamRepository, useTodoRepository };
export default DIContext;
