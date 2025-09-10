/// <reference types="vitest" />
import { defineConfig } from 'vite';
import swc from 'unplugin-swc';
import path from 'path';

export default defineConfig({
  plugins: [
    // Use SWC for faster TypeScript compilation
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: false,
          decorators: true,
        },
        target: 'es2022',
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  test: {
    // Test configuration
    globals: true,
    environment: 'node',
    setupFiles: ['./src/setup-vitest.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/main.ts',
        '**/setup-*.{js,ts}',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    },
    
    // File patterns (matches existing Jest pattern)
    include: ['src/**/__tests__/**/*.{test,spec}.{js,ts}', 'src/**/*.{test,spec}.{js,ts}'],
    exclude: [
      'node_modules/',
      'dist/',
      '.git/',
      '.cache/',
    ],
    
    // Test timeout (useful for integration tests)
    testTimeout: 10000,
    
    // Reporter configuration
    reporter: ['verbose'],
    
    // Mock configuration
    clearMocks: true,
    restoreMocks: true,
    
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
  
  // Resolve configuration for better module resolution
  resolve: {
    alias: {
      // These should match your tsconfig paths
      '@src': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@config': path.resolve(__dirname, './src/config'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
  
  // Define for environment variables
  define: {
    // Vitest environment variables
    'process.env.NODE_ENV': '"test"',
  },
});