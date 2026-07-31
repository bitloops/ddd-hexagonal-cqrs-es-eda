# Getting Started with the Bitloops Todo App

<img width="488" alt="image" src="https://github.com/bitloops/ddd-hexagonal-cqrs-es-eda/assets/1571105/4570473b-4e67-4050-9935-967acfe0b7c6">

This project was bootstrapped with [Vite](https://vite.dev/).

You should not need to run it directly from this folder as it is part of the docker build file but if you want to run it locally for development you can follow the instructions below at "Available Scripts".

## Web App Design

The web app is using a flavour of the MVVM (Model-View-View Model) pattern. You should be aware of the following ideas:

### Components

Here we have simple React code combined with imports of CSS files for the formatting. These components do not have state and you could inject anything you like through the props to test them.

### Controllers

A controller wraps a Component and maps the functions and values coming from a View Model (see below). You might have the occasional useState for maybe an [open, setOpen] value but nothing more.

### State

Redux Toolkit owns the application state. Controllers select state and dispatch actions while presentational components remain focused on rendering and user interaction.

### View models

Selectors provide the query side of the UI model, while Redux actions and async thunks handle state changes and side effects.

### Repositories

Repositories are used to interact with the app state (e.g. localStorage) and the Services (see below). For example, a service expects some authentication metadata (JWT) with the requests and instead of complicating the ViewModel with these details, a Repository provides a cleaner interface to the ViewModel for using the Services by taking care of the JWT injection etc. You can also use Repositories to deal with local caching etc.

### Services

Services wrap the generated REST client and SSE connection so transport details do not leak into UI components.

## Technologies Used

The frontend communicates with the backend over REST. `@hey-api/openapi-ts` generates the typed API client from the backend OpenAPI document; after the contract changes, run `pnpm --dir frontend openapi-ts` from the repository root.

To receive realtime notifications from the backend, SSE (Server Sent Events) are being used.

The SSE client reconnects after transient failures and sends a heartbeat so the backend can clean up abandoned subscriptions.

## Launch the app using the Dockerfile

To build the image:

```bash
docker build -f frontend/Dockerfile -t todo-frontend .
```

To run the container:

```bash
docker run -dp 4173:8080 todo-frontend
```

## Available Scripts

In the project directory, you can run:

### `pnpm install --frozen-lockfile`

Installs all the dependencies. This is needed before you run the start script.

### `pnpm --dir frontend dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm --dir frontend build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

To preview the production build, run:

```bash
pnpm --dir frontend preview
```

### `pnpm --dir frontend openapi-ts`

Regenerates the `api` folder files based on Swagger and Open API definitions coming from the backend.

# React + TypeScript + Vite + Redux Toolkit

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
