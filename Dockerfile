FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy built artifacts from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

COPY .prod.env .env

ENV NODE_ENV=prod   

# Set the entrypoint
ENTRYPOINT ["node", "dist/main.js"]