# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=18.18.0

FROM node:${NODE_VERSION}-alpine

# Create a group and user
RUN addgroup -S app && adduser -S app -G app

# Use production node environment by default.
ENV NODE_ENV development

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Change ownership of the working directory
# This is done here to ensure that all copied files/directories
# have the correct permissions.
RUN chown -R app:app /app

COPY --chown=app:app . .

# Use the non-root user to run the application
USER app

# Expose the port that the application listens on.
EXPOSE 3000 6789

# Run the application.
CMD ["npm", "start"]
