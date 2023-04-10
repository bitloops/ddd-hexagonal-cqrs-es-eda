export const SUCCESS_CASE = {
  userId: '123',
  completedTodos: 1,
  userEmail: 'user@bitloops.com',
  notificationTemplate: {
    id: '1',
    type: 'firstTodo',
    template: 'Congratulations on completing your first todo!',
  },
};

export const UNSUCCESS_REPO_ERROR_CASE = {
  userId: '1234',
  completedTodos: 1,
  userEmail: 'user@bitloops.com',
};

export const UNSUCCESS_NOT_FIRST_TODO_CASE = {
  userId: '12',
  completedTodos: 5,
  userEmail: 'user@bitloops.com',
};

export const UNSUCCESS_USER_REPO_ERROR_CASE = {
  userId: '12345',
  completedTodos: 1,
  userEmail: 'user@bitloops.com',
};

export const UNSUCCESS_USER_NOT_FOUND_CASE = {
  userId: '123456',
  completedTodos: 1,
  userEmail: 'user@bitloops.com',
};
