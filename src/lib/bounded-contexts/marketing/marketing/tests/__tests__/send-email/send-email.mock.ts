export const SEND_EMAIL_SUCCESS_CASE = {
  userId: '123',
  sendCommand: {
    destination: 'user@bitloops.com',
    origin: 'marketing@bitloops.com',
    content: 'HelloWorld!',
  },
};

export const SEND_EMAIL_REPO_ERROR_CASE = {
  userId: '1234',
  sendCommand: {
    destination: 'user2@bitloops.com',
    origin: 'marketing@bitloops.com',
    content: 'HelloWorld!',
  },
};
