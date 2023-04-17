## Transpile bl code

Transpile your bl code giving as target option path the absolute path of your project's `src/lib`.

Remove strict and strictNullChecks from your tsconfig if present.

## Install dependencies

```bash
# install bitloops plugins
yarn add @bitloops/bl-boilerplate-core \
      @bitloops/bl-boilerplate-infra-mongo \
      @bitloops/bl-boilerplate-infra-nest-auth-passport \
      @bitloops/bl-boilerplate-infra-nest-jetstream \
      @bitloops/bl-boilerplate-infra-postgres \
      @bitloops/bl-boilerplate-infra-telemetry \
      nats \
      mongodb
```

### Api module

Each controller will have injected the commandBus or/and the queryBus from the bus-plugin you will be using. On `api.module.ts` we register the controllers, import the buses-plugin, the auth-module plugin and nest's config module if needed. Each controller dispatches a command/query using the appropriate bus and then handles the response, by matching each error to the appropriate response code.

### App module

We will be registering each bl module, connecting it with its required adapters. We can place this code under `src/bounded-contexts/[bounded-context-name]/[module-name]/`.

Each bl module is a dynamic module, so when we import it, we need to pass the injected modules & adapters(nestjs providers) as arguments.

Every bl module has a `constants.ts` file, listing all the injection tokens its respective infra module will have to provide.

## Tracing

We can trace the execution of a method by using the @Traceable decorator provided by the bitloops-tracing plugin. Let's say we want to use it on the api module to trace the duration of a `addTodo` post http route. First we have to register the plugin in the `api.module.ts`. After that we just decorate the method we want.

```ts
  @OtherDecorators...
  @Traceable()
  async addTodo() {
    // Controller logic
  }
```

We can also trace the execution of a repo method, or any adapter we have concreted in the same way.

```ts
  @OtherDecorators...
  @Traceable()
  async save(entity: Entity) {
    // ...
  }
```
