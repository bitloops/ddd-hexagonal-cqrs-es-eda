import { defineConfig, defaultPlugins } from '@hey-api/openapi-ts';

export default defineConfig({
  input: '../backend/swagger.json',
  output: 'src/api',
  plugins: [
    ...defaultPlugins,
    {
      asClass: false, // default 
      name: '@hey-api/sdk',
    },
  ],
});