export const MODIFY_TITLE_SUCCESS_CASE = {
  titleId: '1',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'modify title' },
  userId: { id: '123' },
  completed: true,
};

export const MODIFY_INVALID_TITLE_CASE = {
  titleId: '12',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'i' },
  userId: { id: '123' },
  completed: false,
};

export const MODIFY_TODO_NOT_FOUND_CASE = {
  titleId: '123',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'modify title' },
  userId: { id: '123' },
  completed: false,
};

export const MODIFY_TODO_GET_BY_ID_REPO_ERROR_CASE = {
  titleId: '1234',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'modify title' },
  userId: { id: '123' },
  completed: false,
};

export const MODIFY_TODO_UPDATE_REPO_ERROR_CASE = {
  titleId: '12345',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'modify title' },
  userId: { id: '123' },
  completed: false,
};
