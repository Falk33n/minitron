FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --verbose
COPY . .
CMD ["yarn", "dev"]

