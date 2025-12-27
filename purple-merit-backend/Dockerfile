# 1. Use Node.js base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Build TypeScript to JavaScript
RUN npx tsc

# 7. Expose the port
EXPOSE 3000

# 8. Start the server
CMD ["node", "dist/server.js"]