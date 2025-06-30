# BDD Tests Readme

## How do I run the tests?

`cd tests`
`npx cucumber-js` or `npm run test`

## Why outside src? Why its own package.json?

Getting cucumber-js to work with TypeScript and with our existing project setup seems like a big pain in the ass. As an alternative, everything runs autonomously and just imports files from the project. If needed, we can fix this in the future.

## Why use the cucumber-js package when other Gherkin packages can work with our setup with less effort?

This `cucumber-js` package is amazing. You only define a step function once and can be reused multiple times. More time writing Gherkin than writing step functions. For example, the counter requires about 40 lines for its tests using `cucumber-js` while over 400 with other packages.

## How do I create new tests?

For each feature you need to create two files:

1. Your `.feature` file that contains Gherkin Given, When, Then statements to be placed in the `tests/features` folder
2. Your `steps.ts` file to be placed under `tests/features/step_definitions`
3. Check the _counter_ example and enjoy testing!

## Code Coverage for Redux Actions

To check code coverage specifically for your Redux actions:

```bash
npm run test:coverage
```

This will:

- Run all your existing Cucumber tests
- Generate coverage reports specifically for Redux actions
- Output a summary in the terminal
- Create detailed HTML reports in the `./coverage` directory

### What's Being Measured

The coverage configuration focuses specifically on:

- All TypeScript files in `src/store/slices/**/*.ts`
- Excludes enum files, type definitions, and declaration files

This ensures you're measuring coverage of the actual action creators and reducers, not just type definitions.

### Viewing Reports

After running the tests, you can:

- See a text summary in the terminal
- Open `./coverage/index.html` in a browser for a detailed visual report
- Check which actions are well-tested and which need more coverage

### Coverage Thresholds

The configuration sets the default thresholds.

You can adjust these in the `.nycrc` file if needed.
