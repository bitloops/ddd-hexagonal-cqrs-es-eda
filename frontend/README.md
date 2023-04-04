# Getting Started with the Bitloops Todo App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You should not need to run it directly from this folder as it is part of the docker build file but if you want to run it locally for development you can follow the instructions below at "Available Scripts".

## Technologies Used

To communicate with the backend, grpc-web is being used for the main functionality while a couple REST requests are used for registration and login.

To receive realtime notifications from the backend, SSE (Server Sent Events) are being used.

The gRPC implementation requires the JWT token to be sent in the authorization headers and it is possible to sent a cache-hash for the backend to check if a get request has the same or new data. If the server sees that the data it is about to send have the same cache-hash then an exception is thrown which is handled on the frontend and does nothing if thrown as it knows that the data already in its local store is up to date. This saves data usage.

The grpc-web SSE implementation has significant limitation for long running connections and it cannot track if a client has disconnected or not. For this reason, the client sends a ping about every minute to notify the backend that the connection is alive. If the ping is not sent, the backend assumes the frontend has disconnected and clears the subscriptions to save resources. In the near future, we will release [Bitloops Ermis](https://bitloops.com/ermis) which will a) allow for scaling of the gateway to multiple instances and b) is connection aware and doesn't require explicit pings.

## Launch the app using the Dockerfile

To build the image:

```bash
docker build -t todo-frontend .
```

To run the container:

```bash
docker run -dp 3000:3000 todo-frontend
```

## Available Scripts

In the project directory, you can run:

### `yarn` or `npm i`

Installs all the dependencies. This is needed before you run the start script.

### `yarn start` or `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build` or `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn proto` or `npm run proto`

Regenerates the TodoServiceClientPb.ts and todo_pb.js and todo_pb.d.ts files based on the todo.proto file.
