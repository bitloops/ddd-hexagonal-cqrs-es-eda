import React, { ReactNode, createContext, useContext } from 'react';
import IamService from '../infra/services/IamService';
import { IamRepository, IIamRepository } from '../infra/repositories/iam';
import { ITodoRepository, TodoRepository } from '../infra/repositories/todo';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TodoServiceClient } from '../bitloops/proto/todo';
import { PROXY_URL } from '../config';

export interface AppContext {
  iamRepository: IIamRepository;
  todoRepository: ITodoRepository;
  todoService: TodoServiceClient;
}

const iamService = new IamService();
const iamRepository = new IamRepository(iamService);
const todoService = new TodoServiceClient(PROXY_URL);
const todoRepository = new TodoRepository(todoService);

export const initialContext: AppContext = {
  iamRepository,
  todoRepository,
  todoService,
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

function useTodoService() {
  return useDIContext().todoService;
}

export { useDIContext, DIProvider, useIamRepository, useTodoRepository, useTodoService };
export default DIContext;
