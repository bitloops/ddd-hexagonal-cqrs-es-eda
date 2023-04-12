export const UNCOMPLETE_TODO_SUCCESS_CASE = {
  userId: { id: '123' },
  id: 'todo1',
  title: { title: 'New todo title' },
  completed: true,
};

export const UNCOMPLETE_TODO_NOT_FOUND_CASE = {
  userId: { id: '123' },
  id: 'todo2',
  title: { title: 'New todo title' },
  completed: true,
};

export const UNCOMPLETE_TODO_REPO_ERROR_GETBYID_CASE = {
  userId: { id: '123' },
  id: 'todo3',
  title: { title: 'New todo title' },
  completed: true,
};

export const UNCOMPLETE_TODO_REPO_ERROR_SAVE_CASE = {
  userId: { id: '1234' },
  id: 'todo4',
  title: { title: 'New todo title' },
  completed: true,
};

export const UNCOMPLETE_TODO_ALREADY_UNCOMPLETED_CASE = {
  userId: { id: '123' },
  id: 'todo5',
  title: { title: 'New todo title' },
  completed: false,
};
