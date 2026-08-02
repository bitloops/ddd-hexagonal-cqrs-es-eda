export const MODIFY_TITLE_SUCCESS_CASE = {
  titleId: '10000000-0000-4000-8000-000000000001',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'modify title' },
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  completed: true,
};

export const MODIFY_INVALID_TITLE_CASE = {
  titleId: '10000000-0000-4000-8000-000000000002',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'i' },
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  completed: false,
};

export const MODIFY_TODO_NOT_FOUND_CASE = {
  titleId: '10000000-0000-4000-8000-000000000003',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'modify title' },
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  completed: false,
};

export const MODIFY_TODO_GET_BY_ID_REPO_ERROR_CASE = {
  titleId: '10000000-0000-4000-8000-000000000004',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'modify title' },
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  completed: false,
};

export const MODIFY_TODO_UPDATE_REPO_ERROR_CASE = {
  titleId: '10000000-0000-4000-8000-000000000005',
  titleBeforeUpdate: { title: 'new title' },
  titleAfterUpdate: { title: 'modify title' },
  userId: { id: '10000000-0000-4000-8000-000000000003' },
  completed: false,
};
