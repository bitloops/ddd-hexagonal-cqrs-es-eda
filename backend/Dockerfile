FROM node:19-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
#      BUILD      
# Install dependencies (--immutable makes sure the exact versions in the lockfile gets installed)
RUN yarn install --immutable
# Build the app
RUN yarn build
#      RUN        
# Set the env to "production"
ENV JWT_SECRET "p2s5v8x/A?D(G+KbPeShVmYq3t6w9z$B"
ENV JWT_LIFETIME_SECONDS 3600
ENV HTTP_IP todo-backend
ENV GRPC_IP todo-backend
ENV IAM_DATABASE_HOST todo-backend
ENV TODO_DATABASE_HOST bl-mongo
ENV PG_IAM_HOST bl-postgres
ENV PG_HOST bl-postgres
ENV MONGO_HOST bl-mongo
ENV MARKETING_DATABASE_HOST bl-mongo
ENV NATS_HOST bl-nats
ENV GRAFANA_ADMIN_USER admin
ENV GRAFANA_ADMIN_PASSWORD admin
ENV NODE_ENV production
ENV AUTH_URL "http://todo-backend:8082/auth/login"
ENV PROXY_URL "http://todo-backend:8080"
ENV REGISTRATION_URL "http://todo-backend:8082/auth/register"
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 8081 8082
# Start the app
CMD [ "yarn", "start:prod" ]