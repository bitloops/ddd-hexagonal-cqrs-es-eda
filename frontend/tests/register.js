const tsConfigPaths = require('tsconfig-paths');
const path = require('path');
const sourceMapSupport = require('source-map-support');
// Install source map support
sourceMapSupport.install();

// Get the project root directory
const baseUrl = path.join(__dirname, '../');

// Define the paths mapping manually to ensure they're correct
const paths = {
  '@src/*': ['src/*'],
  '@store/*': ['src/store/*'],
  '@components/*': ['src/components/*'],
  '@api-types': ['src/api/types/schema'],
  '@utils/*': ['src/utils/*'],
};

// Register the TypeScript path mappings
tsConfigPaths.register({
  baseUrl,
  paths,
});
