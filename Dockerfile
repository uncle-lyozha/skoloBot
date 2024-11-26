FROM node:18-alpine AS build
WORKDIR /app

# Set build-time environment variables
ENV BOT_TOKEN=6854072392:AAEV0i6afO1GPjmABelpICDJ6IzKay9nvro
ENV CHAT_ID = -1001524872428
ENV MONGO=mongodb+srv://jeerastafar:n0KojK5XywyH3Vtk@skolocluster.027kjsv.mongodb.net/?retryWrites=true&w=majority&appName=SkoloCluster


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

# Set the entrypoint
ENTRYPOINT ["node", "dist/main.js"]