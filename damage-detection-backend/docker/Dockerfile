# Multi-stage Dockerfile for NestJS Backend
# Supports: development, production, test, and migration targets

# Base stage with common dependencies
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl \
    bash

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Development stage
FROM base AS development

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chmod 755 uploads

# Create non-root user for security
RUN addgroup -g 1001 -S nestjs && \
    adduser -S nestjs -u 1001

# Change ownership of app directory
RUN chown -R nestjs:nestjs /app
USER nestjs

# Expose port
EXPOSE 3001

# Start the application in development mode with hot reload
CMD ["npm", "run", "start:dev"]

# Build stage for production
FROM base AS builder

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM base AS production

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy any additional runtime files
COPY --from=builder /app/uploads ./uploads

# Create non-root user for security
RUN addgroup -g 1001 -S nestjs && \
    adduser -S nestjs -u 1001

# Change ownership of app directory
RUN chown -R nestjs:nestjs /app
USER nestjs

# Expose port
EXPOSE 3001

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]

# Test stage
FROM development AS test

# Switch to root to install additional test dependencies
USER root

# Install test-specific dependencies if needed
RUN npm ci

# Copy test configurations
COPY jest.config.js ./
COPY test/ ./test/

# Create test uploads directory
RUN mkdir -p test-uploads && chmod 755 test-uploads

# Change ownership back to nestjs user
RUN chown -R nestjs:nestjs /app
USER nestjs

# Expose port for test server
EXPOSE 3002

# Run tests
CMD ["npm", "run", "test"]

# Migration stage for database operations
FROM base AS migration

# Install all dependencies (including dev dependencies for TypeORM CLI)
RUN npm ci

# Copy source code and built application
COPY . .
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nestjs && \
    adduser -S nestjs -u 1001

# Change ownership of app directory
RUN chown -R nestjs:nestjs /app
USER nestjs

# Run migrations
CMD ["npm", "run", "migration:run"]