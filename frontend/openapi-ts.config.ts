import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8080/api-json',
  output: 'src/api',
  plugins: ['@hey-api/client-fetch'],
});
