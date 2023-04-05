export const INCREMENT_TODOS_SUCCESS_USER_EXISTS_CASE = {
  id: '123',
  completedTodos: 0,
  email: 'test@gmail.com',
};

export const INCREMENT_TODOS_SUCCESS_USER_DOESNT_EXIST_CASE = {
  id: '1234',
};

export const INCREMENT_TODOS_INVALID_COUNTER_CASE = {
  id: '12345',
  completedTodos: -10,
};

export const INCREMENT_TODOS_REPO_ERROR_GETBYID_CASE = {
  id: '123456',
  completedTodos: 1,
};

export const INCREMENT_TODOS_REPO_ERROR_SAVE_CASE = {
  id: '1234567',
  completedTodos: 1,
  email: 'test@bitloops.com',
};
