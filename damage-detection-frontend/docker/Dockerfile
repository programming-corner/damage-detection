# Use Node.js 20 LTS as base image (required for Vite 7+)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies needed for React Native
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    openjdk11-jre

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps for React Native compatibility
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose Metro bundler port
EXPOSE 8081

# Expose development server port
EXPOSE 3000

# Create non-root user for security
RUN addgroup -g 1001 -S reactnative && \
    adduser -S reactnative -u 1001

# Change ownership of app directory
RUN chown -R reactnative:reactnative /app
USER reactnative

# Start development server (web by default, can be overridden)
CMD ["npm", "run", "web"]