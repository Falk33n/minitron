FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --verbose
COPY . .
CMD ["npm", "run dev"]
