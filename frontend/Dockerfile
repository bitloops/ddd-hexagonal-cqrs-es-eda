FROM node:19-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (--immutable makes sure the exact versions in the lockfile gets installed)
RUN yarn install --immutable
# Build the app
RUN yarn build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
ENV AUTH_URL "http://host.docker.internal:8082/auth/login"
ENV PROXY_URL "http://host.docker.internal:8080"
ENV REGISTRATION_URL "http://host.docker.internal:8082/auth/register"
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "npx", "serve", "build" ]