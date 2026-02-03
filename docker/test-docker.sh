#!/bin/bash

# Docker Test Script for Damage Detection App
echo "🧪 Testing Docker setup for Damage Detection App..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

echo "✅ Docker Compose is available"

# Build the development image
echo "🔨 Building development Docker image..."
if docker-compose build; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Failed to build Docker image"
    exit 1
fi

# Start the containers
echo "🚀 Starting containers..."
if docker-compose up -d; then
    echo "✅ Containers started successfully"
else
    echo "❌ Failed to start containers"
    exit 1
fi

# Wait a moment for services to start
sleep 10

# Check if Metro bundler is accessible
echo "🔍 Checking Metro bundler..."
if curl -f -s http://localhost:8081/status > /dev/null 2>&1; then
    echo "✅ Metro bundler is accessible at http://localhost:8081"
else
    echo "⚠️  Metro bundler not yet accessible (this is normal, it takes time to start)"
fi

# Show running containers
echo "📊 Running containers:"
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20 react-native-app

echo ""
echo "🎉 Docker test completed!"
echo ""
echo "📱 Next steps:"
echo "1. Metro bundler: http://localhost:8081"
echo "2. View logs: ./docker-dev.sh logs"
echo "3. Stop services: ./docker-dev.sh stop"
echo ""
echo "🔍 To debug:"
echo "- Shell access: ./docker-dev.sh shell"
echo "- View all logs: docker-compose logs -f"