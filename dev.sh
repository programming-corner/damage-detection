#!/bin/bash

# Full-Stack Development Environment Script
# Manages both frontend and backend services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to display help
show_help() {
    echo "Damage Detection System - Development Environment"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start         Start all services (frontend, backend, database)"
    echo "  frontend      Start only frontend development server"
    echo "  backend       Start only backend services (when available)"
    echo "  db            Start only database services"
    echo "  stop          Stop all services"
    echo "  restart       Restart all services"
    echo "  logs          Show logs for all services"
    echo "  clean         Clean up containers and volumes"
    echo "  setup         Initial setup and dependency installation"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start                 # Start full development environment"
    echo "  $0 frontend              # Start only React Native web dev server"
    echo "  $0 logs                  # View logs from all services"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to start all services
start_all() {
    print_status "Starting full-stack development environment..."
    check_docker
    
    # Start with database and backend first
    docker-compose up -d postgres redis
    print_success "Database services started"
    
    # Wait a moment for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 5
    
    # Start backend (when available)
    if [ -f "damage-detection-backend/package.json" ]; then
        docker-compose up -d backend
        print_success "Backend API started"
    else
        print_warning "Backend not yet implemented - skipping backend service"
    fi
    
    # Start frontend
    docker-compose up -d frontend
    print_success "Frontend started"
    
    print_success "Full-stack environment is running!"
    echo ""
    echo "🌐 Frontend (Web): http://localhost:3000"
    echo "📱 React Native Metro: http://localhost:8081"
    echo "🔗 Backend API: http://localhost:3001 (when implemented)"
    echo "🗄️  Database: localhost:5432"
    echo "📦 Redis: localhost:6379"
    echo ""
    echo "Use '$0 logs' to view service logs"
    echo "Use '$0 stop' to stop all services"
}

# Function to start only frontend
start_frontend() {
    print_status "Starting frontend development server..."
    cd damage-detection-frontend
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    print_status "Starting React Native web development server..."
    npm run web &
    
    print_success "Frontend development server started!"
    echo "🌐 Web App: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop the development server"
    
    # Wait for the background process
    wait
}

# Function to start only database services
start_db() {
    print_status "Starting database services..."
    check_docker
    docker-compose up -d postgres redis
    print_success "Database services started!"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo "📦 Redis: localhost:6379"
}

# Function to stop all services
stop_all() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped"
}

# Function to restart all services
restart_all() {
    print_status "Restarting all services..."
    stop_all
    sleep 2
    start_all
}

# Function to show logs
show_logs() {
    print_status "Showing logs from all services..."
    docker-compose logs -f
}

# Function to clean up
clean_up() {
    print_warning "This will remove all containers, networks, and volumes."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to setup the project
setup_project() {
    print_status "Setting up Damage Detection System..."
    
    # Setup frontend
    if [ -d "damage-detection-frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd damage-detection-frontend
        npm install
        cd ..
        print_success "Frontend setup completed"
    fi
    
    # Setup backend (when available)
    if [ -d "damage-detection-backend" ] && [ -f "damage-detection-backend/package.json" ]; then
        print_status "Installing backend dependencies..."
        cd damage-detection-backend
        npm install
        cd ..
        print_success "Backend setup completed"
    else
        print_warning "Backend not yet implemented - skipping backend setup"
    fi
    
    print_success "Project setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Run '$0 start' to start the development environment"
    echo "2. Open http://localhost:3000 to view the web app"
}

# Main command handling
case "${1:-help}" in
    start)
        start_all
        ;;
    frontend)
        start_frontend
        ;;
    backend)
        print_warning "Backend not yet implemented"
        print_status "For now, use 'start' to run frontend with database services"
        ;;
    db)
        start_db
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_up
        ;;
    setup)
        setup_project
        ;;
    help|*)
        show_help
        ;;
esac