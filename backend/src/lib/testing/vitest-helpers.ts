import { vi } from 'vitest';
import { TestingModule, Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Vitest helper utilities for NestJS testing
 * Provides common testing patterns and utilities for the DDD/CQRS application
 */

/**
 * Creates a mock ConfigService for testing
 * @param config - Configuration object
 * @returns Mocked ConfigService
 */
export const createMockConfigService = (config: Record<string, any> = {}) => ({
  get: vi.fn((key: string, defaultValue?: any) => config[key] ?? defaultValue),
});

/**
 * Creates a mock repository with common CRUD methods
 * @returns Mock repository object
 */
export const createMockRepository = () => ({
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getById: vi.fn(),
  getByEmail: vi.fn(),
  getAll: vi.fn(),
  findOne: vi.fn(),
  findMany: vi.fn(),
});

/**
 * Creates a mock domain event bus
 * @returns Mock event bus
 */
export const createMockEventBus = () => ({
  publish: vi.fn(),
  publishAll: vi.fn(),
  subscribe: vi.fn(),
});

/**
 * Creates a mock Prisma service with transaction support
 * @returns Mock Prisma service
 */
export const createMockPrismaService = () => {
  const mockService = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      upsert: vi.fn(),
    },
    todo: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn((fn) => fn(mockService)),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
  return mockService;
};

/**
 * Creates a testing module builder with common providers
 * @param providers - Additional providers to include
 * @returns TestingModule builder
 */
export const createTestingModuleBuilder = (providers: any[] = []) => {
  return Test.createTestingModule({
    providers: [
      ...providers,
      {
        provide: ConfigService,
        useValue: createMockConfigService(),
      },
    ],
  });
};

/**
 * Mock async local storage for context testing
 */
export const createMockAsyncLocalStorage = () => {
  const mockGet = vi.fn();
  return {
    getStore: vi.fn(() => ({
      get: mockGet,
    })),
    mockGet,
  };
};

/**
 * Helper for testing domain entities
 * @param EntityClass - Domain entity class
 * @param primitives - Primitive data for entity
 * @returns Entity instance with mocked methods
 */
export const createMockEntity = <T>(EntityClass: new (...args: any[]) => T, primitives: any) => {
  const entity = {
    ...primitives,
    toPrimitives: vi.fn().mockReturnValue(primitives),
    domainEvents: [],
    id: primitives.id,
  } as unknown as T;
  
  return entity;
};

/**
 * Helper for testing value objects
 * @param ValueObjectClass - Value object class  
 * @param value - Value object data
 * @returns Value object instance
 */
export const createMockValueObject = <T>(ValueObjectClass: new (...args: any[]) => T, value: any) => {
  return {
    ...value,
    valueOf: vi.fn().mockReturnValue(value),
  } as unknown as T;
};

/**
 * Mock JWT payload for testing authentication
 */
export const createMockJwtPayload = (userId: string = 'test-user-id') => ({
  sub: userId,
  email: 'test@example.com',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
});

/**
 * Setup for testing command/query handlers
 * @param HandlerClass - Handler class to test
 * @param dependencies - Handler dependencies
 * @returns Testing module and handler instance
 */
export const setupHandlerTest = async <T>(
  HandlerClass: new (...args: any[]) => T,
  dependencies: any[] = []
) => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      HandlerClass,
      ...dependencies,
    ],
  }).compile();

  const handler = module.get<T>(HandlerClass);
  
  return { module, handler };
};

/**
 * Helper to create full NestJS application for integration tests
 * @param AppModule - Application module
 * @returns Compiled NestJS application
 */
export const createTestApp = async (AppModule: any): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  
  return app;
};

/**
 * Sleep utility for async tests
 * @param ms - Milliseconds to wait
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));