// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID(),
  },
});

jest.mock('@bitloops/bl-boilerplate-infra-telemetry', () => ({
  Traceable: () => jest.fn(),
}));

const mockGet = jest.fn();
jest.mock('@bitloops/bl-boilerplate-core', () => ({
  ...jest.requireActual('@bitloops/bl-boilerplate-core'),
  asyncLocalStorage: {
    getStore: jest.fn(() => ({
      get: mockGet,
    })),
  },
}));
