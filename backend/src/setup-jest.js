// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID(),
  },
});

jest.mock('@lib/infra/telemetry', () => ({
  Traceable: () => jest.fn(),
}));

const mockGet = jest.fn();
jest.mock('ddd-tactical-core-boilerplate', () => ({
  ...jest.requireActual('ddd-tactical-core-boilerplate'),
  asyncLocalStorage: {
    getStore: jest.fn(() => ({
      get: mockGet,
    })),
  },
}));
