# Dockerfile with Node (alpine) and pnpm -- to expose ws port 8080

FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source files
COPY . .

# Build TypeScript
RUN pnpm build

# Expose WebSocket port
EXPOSE 8080

# Start the server
CMD ["pnpm", "start"]