# Step 1: Build the app in a node environment
FROM node:18-alpine as builder

# Set the working directory and ensure user permissions are correct
WORKDIR /app
# Optional: Change ownership to the node user (uncomment if needed)
# RUN chown node:node /app

# Copy package.json, yarn.lock
COPY package.json yarn.lock ./

# Install dependencies with more verbose output (could provide more insight on errors)
RUN yarn install --frozen-lockfile --verbose

# Copy the rest of your app's source code
COPY . .

# Build the application
RUN yarn build

# Step 2: Use a lighter node image to run the app
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json /app/yarn.lock ./

# Install production dependencies
RUN yarn install --production --frozen-lockfile --verbose

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the app
CMD ["yarn", "start"]