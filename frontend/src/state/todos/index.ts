import { atom, atomFamily } from 'recoil';

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

// Mock async function to simulate fetching data from the database
// export const fetchTodoList = async (): Promise<Todo[]> =>
//   new Promise((resolve) => {
//     setTimeout(
//       () =>
//         resolve([
//           { id: '1', title: 'Do homework', isCompleted: false },
//           { id: '2', title: 'Wash dishes', isCompleted: false },
//         ]),
//       500
//     );
//   });

export const todosState = atomFamily<Todo, string>({
  key: 'TodosState',
  default: { id: '0', title: '', isCompleted: false }, // Provide a default todo item
});

export const todoIdsState = atom<string[]>({
  key: 'TodoIdsState',
  default: [],
});
