#!/bin/bash

# Docker Development Helper Script for Damage Detection App
echo "🐳 Docker Development Helper for Damage Detection App"

case "$1" in
    "build")
        echo "🔨 Building development Docker image..."
        docker-compose build
        ;;
    "start")
        echo "🚀 Starting development environment..."
        docker-compose up -d
        echo "✅ Services started!"
        echo "📱 Metro bundler: http://localhost:8081"
        echo "📊 App logs: docker-compose logs -f react-native-app"
        ;;
    "stop")
        echo "🛑 Stopping development environment..."
        docker-compose down
        ;;
    "restart")
        echo "🔄 Restarting development environment..."
        docker-compose restart
        ;;
    "logs")
        echo "📊 Showing app logs..."
        docker-compose logs -f react-native-app
        ;;
    "shell")
        echo "💻 Opening shell in React Native container..."
        docker-compose exec react-native-app sh
        ;;
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v
        docker system prune -f
        ;;
    "install")
        echo "📦 Installing new npm packages..."
        docker-compose exec react-native-app npm install
        ;;
    "android")
        echo "🤖 Building for Android..."
        docker-compose exec react-native-app npx react-native run-android
        ;;
    "status")
        echo "📊 Docker services status:"
        docker-compose ps
        ;;
    *)
        echo "📚 Usage: ./docker-dev.sh [command]"
        echo ""
        echo "Available commands:"
        echo "  build     - Build Docker images"
        echo "  start     - Start development environment"
        echo "  stop      - Stop all services"
        echo "  restart   - Restart services"
        echo "  logs      - Show app logs"
        echo "  shell     - Open shell in container"
        echo "  clean     - Clean up Docker resources"
        echo "  install   - Install npm packages"
        echo "  android   - Build for Android"
        echo "  status    - Show services status"
        echo ""
        echo "Examples:"
        echo "  ./docker-dev.sh start    # Start development"
        echo "  ./docker-dev.sh logs     # View logs"
        echo "  ./docker-dev.sh shell    # Debug in container"
        ;;
esac