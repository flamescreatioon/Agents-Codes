# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your app
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the app port
EXPOSE 8080

# Start the app
CMD ["node", "src/index.js"]
