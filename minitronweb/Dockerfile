# Use official Node.js image as base
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm install next && yarn build

# Command to run the Next.js application
CMD ["yarn", "start"]