### Source code under `lib/` folder is transpiled based on the bl code we have written.

It contains our application and domain layers. Each application handler/use-case is injected some ports which are associated with a token. This token will be used to attach the concreted adapter.

### Every folder under `bitloops/` is a nestjs plugin, and can be assumed to be a npm package.

Add `config/` folder and define some initial configuration for your app. e.g. http_port, host etc. You will be adding database, apiKeys, secrets and so on there later based on your adapters.
`yarn add @nestjs/config`. Create a `.development.env` file and gitignore it.

## Project structure

We start with 2 root modules. The `api` module, which contains all the controllers and acts as our application gateway, and the `app` module which is a modular monolith containing all our modules(with their infra, application & domain layers). We need to write the api code, and the infra code for each module(with concretions of each port used by application layers).

### Api module

Each controller will have injected the commandBus or/and the queryBus from the bus-plugin you will be using. On `api.module.ts` we register the controllers, and as imports the buses-plugin, the auth-module plugin and nest' config module if we need it. Each controller dispatches a command/query using the appropriate bus and then handles the response matching each error to the appropriate response code.

- grpc
  `yarn add @grpc/grpc-js google-protobuf`

### App module

We will be registering each bl module, connecting it with its required adapters. We can place this code under `src/bounded-contexts/[bounded-context-name]/[module-name]/`.

Each bl module is a dynamic module, so when we import it, we need to pass the injected modules & adapters(nestjs providers) as arguments.

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
