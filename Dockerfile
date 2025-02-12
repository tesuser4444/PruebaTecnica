# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./backend/package*.json /app
# Install dependencies
RUN npm install
# Copy only the backend src to the docker image
COPY ./backend/src /app

# Build the Prisma client (if you're using Prisma)
RUN npx prisma migrate dev --name init

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]