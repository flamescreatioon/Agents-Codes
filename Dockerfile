# Use Node.js LTS on Alpine for small image size
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install system deps for sqlite3 prebuilt binaries compatibility
RUN apk add --no-cache python3 make g++

# Copy package manifests and install deps
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source
COPY src ./src

# Environment
ENV NODE_ENV=production \
    PORT=8080 \
    DATABASE_PATH=/data/agent.db

# Expose the port Fly will route to
EXPOSE 8080

# Create mount point for persistent data
VOLUME ["/data"]

# Start the server
CMD ["npm", "start"]
