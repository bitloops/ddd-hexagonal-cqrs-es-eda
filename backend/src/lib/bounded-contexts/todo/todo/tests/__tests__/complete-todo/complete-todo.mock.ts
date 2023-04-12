export const COMPLETE_TODO_SUCCESS_CASE = {
  userId: { id: '1234' },
  id: 'todo1',
  title: { title: 'New todo title' },
  completed: false,
};

export const COMPLETE_TODO_NOT_FOUND_CASE = {
  userId: { id: '123' },
  id: 'todo2',
  title: { title: 'New todo title' },
  completed: false,
};

export const COMPLETE_TODO_REPO_ERROR_GETBYID_CASE = {
  userId: { id: '123' },
  id: 'todo3',
  title: { title: 'New todo title' },
  completed: false,
};

export const COMPLETE_TODO_REPO_ERROR_SAVE_CASE = {
  userId: { id: '123' },
  id: 'todo4',
  title: { title: 'New todo title' },
  completed: false,
};

export const COMPLETE_TODO_ALREADY_COMPLETED_CASE = {
  userId: { id: '123' },
  id: 'todo5',
  title: { title: 'New todo title' },
  completed: true,
};
