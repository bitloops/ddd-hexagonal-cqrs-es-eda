import { vi } from 'vitest';
import 'reflect-metadata';

// Global crypto support for Node.js environment
const crypto = globalThis.crypto ?? require('crypto');
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID(),
  },
});

// Mock the telemetry module for testing
vi.mock('@lib/infra/telemetry', () => ({
  Traceable: () => vi.fn(),
}));

// Mock the bitloops core async local storage
const mockGet = vi.fn();
vi.mock('@bitloops/bl-boilerplate-core', async () => {
  const actual = await vi.importActual<typeof import('@bitloops/bl-boilerplate-core')>('@bitloops/bl-boilerplate-core');
  return {
    ...actual,
    asyncLocalStorage: {
      getStore: vi.fn(() => ({
        get: mockGet,
      })),
    },
  };
});

// Export mockGet for use in tests
export { mockGet };