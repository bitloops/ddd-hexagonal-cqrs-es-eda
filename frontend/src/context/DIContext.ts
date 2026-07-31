import { createContext, useContext } from 'react';

import type { IIamRepository } from '../infra/interfaces/IIamRepository';
import type { ITodoRepository } from '../infra/interfaces/ITodoRepository';
import IamRepository from '../infra/repositories/iam';
import TodoRepository from '../infra/repositories/todo';
import IamService from '../infra/services/IamService';

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

export const DIContext = createContext<AppContext | undefined>(undefined);

export function useDIContext(): AppContext {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useDIContext must be used within a DIProvider');
  }
  return context;
}

export function useIamRepository(): IIamRepository {
  return useDIContext().iamRepository;
}

export function useTodoRepository(): ITodoRepository {
  return useDIContext().todoRepository;
}

export default DIContext;
