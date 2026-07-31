# Frontend tests

These Cucumber scenarios exercise the todo Redux reducer through the same events
that arrive from the backend event stream. The Node unit-test lane protects
transport-to-UI mappings such as `completed` to `isCompleted`.

## Run the tests

From the repository root:

```bash
pnpm --filter @bitloops/todo-frontend-behaviour-tests test
pnpm --filter @bitloops/todo-frontend-behaviour-tests typecheck
```

The default test command runs the typecheck, unit tests and Cucumber scenarios.
The package uses native ESM and `tsx`; there is no CommonJS, Babel or `ts-node`
registration layer.

## Add a behaviour

Each feature normally needs:

1. A `.feature` file containing the Gherkin scenarios under `features`.
2. TypeScript step definitions under `features/step_definitions`.

Keep these scenarios focused on externally meaningful state transitions. Code
coverage belongs to the faster frontend unit-test lane rather than this behaviour
suite.
