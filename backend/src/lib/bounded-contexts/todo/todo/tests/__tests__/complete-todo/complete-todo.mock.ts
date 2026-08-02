export const COMPLETE_TODO_SUCCESS_CASE = {
  userId: { id: '10000000-0000-4000-8000-000000000004' },
  id: '20000000-0000-4000-8000-000000000001',
  title: { title: 'New todo title' },
  completed: false,
};

export const COMPLETE_TODO_NOT_FOUND_CASE = {
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  id: '20000000-0000-4000-8000-000000000002',
  title: { title: 'New todo title' },
  completed: false,
};

export const COMPLETE_TODO_REPO_ERROR_GETBYID_CASE = {
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  id: '20000000-0000-4000-8000-000000000003',
  title: { title: 'New todo title' },
  completed: false,
};

export const COMPLETE_TODO_REPO_ERROR_SAVE_CASE = {
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  id: '20000000-0000-4000-8000-000000000004',
  title: { title: 'New todo title' },
  completed: false,
};

export const COMPLETE_TODO_ALREADY_COMPLETED_CASE = {
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  id: '20000000-0000-4000-8000-000000000005',
  title: { title: 'New todo title' },
  completed: true,
};
