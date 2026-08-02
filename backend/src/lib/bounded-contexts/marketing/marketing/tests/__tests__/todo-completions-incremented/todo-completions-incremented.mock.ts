export const SUCCESS_CASE = {
  userId: '10000000-0000-4000-8000-000000000003',
  completedTodos: 1,
  userEmail: 'user@bitloops.com',
  notificationTemplate: {
    id: '10000000-0000-4000-8000-000000000001',
    type: 'firstTodo',
    template: 'Congratulations on completing your first todo!',
  },
};

export const UNSUCCESS_REPO_ERROR_CASE = {
  userId: '10000000-0000-4000-8000-000000000004',
  completedTodos: 1,
  userEmail: 'user@bitloops.com',
};

export const UNSUCCESS_NOT_FIRST_TODO_CASE = {
  userId: '10000000-0000-4000-8000-000000000002',
  completedTodos: 5,
  userEmail: 'user@bitloops.com',
};

export const UNSUCCESS_USER_REPO_ERROR_CASE = {
  userId: '10000000-0000-4000-8000-000000000005',
  completedTodos: 1,
  userEmail: 'user@bitloops.com',
};

export const UNSUCCESS_USER_NOT_FOUND_CASE = {
  userId: '10000000-0000-4000-8000-000000000006',
  completedTodos: 1,
  userEmail: 'user@bitloops.com',
};
