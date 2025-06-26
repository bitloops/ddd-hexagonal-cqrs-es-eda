FROM node:22-alpine
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies
RUN npm install
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
ENV AUTH_URL "http://host.docker.internal:8080/auth/login"
ENV TODO_URL "http://host.docker.internal:8080"
ENV REGISTRATION_URL "http://host.docker.internal:8080/auth/register"
# Expose the port on which the app will be running (4173 is the default that Vite `preview` uses)
EXPOSE 4173
# Start the app
CMD [ "npm", "run", "preview" ]