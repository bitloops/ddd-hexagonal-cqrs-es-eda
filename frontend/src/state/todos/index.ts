import { atom, atomFamily } from 'recoil';
import Todo from '../../models/Todo';

export const todosState = atomFamily<Todo, string>({
  key: 'TodosState',
  default: { id: '0', title: '', isCompleted: false }, // Provide a default todo item
});

export const todoIdsState = atom<string[]>({
  key: 'TodoIdsState',
  default: [],
});
