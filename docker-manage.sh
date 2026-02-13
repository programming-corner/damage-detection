#!/bin/bash

# Docker Compose Management Script
# Unified script to manage all environments with Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=""
ACTION=""
COMPOSE_FILE="docker-compose.unified.yml"
ENV_FILE=""

# Available environments
ENVIRONMENTS=("development" "production" "test")
ACTIONS=("up" "down" "build" "logs" "ps" "exec" "shell" "clean" "migrate" "seed")

# Help function
show_help() {
    echo -e "${BLUE}Docker Compose Management Script${NC}"
    echo ""
    echo "Usage: $0 [ENVIRONMENT] [ACTION] [OPTIONS]"
    echo ""
    echo -e "${GREEN}Environments:${NC}"
    echo "  dev, development  - Development environment with hot reload"
    echo "  prod, production  - Production environment"
    echo "  test              - Testing environment"
    echo ""
    echo -e "${GREEN}Actions:${NC}"
    echo "  up                - Start services"
    echo "  down              - Stop services"
    echo "  build             - Build images"
    echo "  logs              - View logs"
    echo "  ps                - List running containers"
    echo "  exec              - Execute command in container"
    echo "  shell             - Open shell in backend container"
    echo "  clean             - Remove all containers, images, and volumes"
    echo "  migrate           - Run database migrations"
    echo "  seed              - Seed database with sample data"
    echo ""
    echo -e "${GREEN}Examples:${NC}"
    echo "  $0 dev up                    # Start development environment"
    echo "  $0 prod up -d                # Start production in background"
    echo "  $0 dev logs backend          # View backend logs in dev"
    echo "  $0 prod exec backend npm run test"
    echo "  $0 dev shell                 # Open shell in backend"
    echo "  $0 test migrate              # Run migrations in test"
    echo ""
}

# Validate environment
validate_environment() {
    local env=$1
    case $env in
        dev|development)
            ENVIRONMENT="development"
            ENV_FILE=".env.development"
            ;;
        prod|production)
            ENVIRONMENT="production"
            ENV_FILE=".env.production"
            ;;
        test)
            ENVIRONMENT="test"
            ENV_FILE=".env.test"
            ;;
        *)
            echo -e "${RED}Error: Invalid environment '$env'${NC}"
            echo "Available environments: ${ENVIRONMENTS[*]}"
            exit 1
            ;;
    esac
}

# Setup environment file
setup_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
    filePath="env.examples/${ENV_FILE}.example"
        if [ -f "$filePath" ]; then
            echo -e "${YELLOW}Creating $ENV_FILE from ${ENV_FILE}.example${NC}"
            cp "$filePath" "$ENV_FILE"
            echo -e "${YELLOW}⚠️  Please review and update $ENV_FILE with appropriate values${NC}"
        else
            echo -e "${RED}Error: Environment file $ENV_FILE and ${ENV_FILE}.example not found${NC}"
            exit 1
        fi
    fi
}

# Get Docker Compose command with profiles
get_compose_cmd() {
    local profile=""
    case $ENVIRONMENT in
        development)
            profile="--profile dev"
            ;;
        production)
            profile="--profile prod"
            ;;
        test)
            profile="--profile test"
            ;;
    esac
    
    echo "docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE $profile"
}

# Execute action
execute_action() {
    local cmd=$(get_compose_cmd)
    
    case $ACTION in
        up)
            echo -e "${GREEN}🚀 Starting $ENVIRONMENT environment...${NC}"
            $cmd up "${@:3}"
            ;;
        down)
            echo -e "${YELLOW}🛑 Stopping $ENVIRONMENT environment...${NC}"
            $cmd down "${@:3}"
            ;;
        build)
            echo -e "${BLUE}🔨 Building images for $ENVIRONMENT...${NC}"
            $cmd build "${@:3}"
            ;;
        logs)
            echo -e "${BLUE}📋 Viewing logs for $ENVIRONMENT...${NC}"
            $cmd logs "${@:3}"
            ;;
        ps)
            echo -e "${BLUE}📊 Listing containers for $ENVIRONMENT...${NC}"
            $cmd ps "${@:3}"
            ;;
        exec)
            if [ -z "$3" ]; then
                echo -e "${RED}Error: Container name required for exec${NC}"
                echo "Example: $0 $1 exec backend bash"
                exit 1
            fi
            $cmd exec "${@:3}"
            ;;
        shell)
            echo -e "${BLUE}🐚 Opening shell in backend container...${NC}"
            $cmd exec backend bash
            ;;
        clean)
            echo -e "${YELLOW}🧹 Cleaning up $ENVIRONMENT environment...${NC}"
            read -p "This will remove all containers, images, and volumes. Continue? (y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                $cmd down -v --remove-orphans
                docker system prune -f
                echo -e "${GREEN}✅ Cleanup completed${NC}"
            else
                echo "Cleanup cancelled"
            fi
            ;;
        migrate)
            echo -e "${BLUE}🗃️ Running database migrations...${NC}"
            docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE --profile migrations up migrations
            ;;
        seed)
            echo -e "${BLUE}🌱 Seeding database...${NC}"
            $cmd exec backend npm run seed
            ;;
        *)
            echo -e "${RED}Error: Invalid action '$ACTION'${NC}"
            echo "Available actions: ${ACTIONS[*]}"
            exit 1
            ;;
    esac
}

# Health check
health_check() {
    echo -e "${BLUE}🏥 Performing health check...${NC}"
    local cmd=$(get_compose_cmd)
    
    # Check if services are running
    echo "Checking service status..."
    $cmd ps
    
    # Check backend health endpoint
    if curl -f http://localhost:3001/health 2>/dev/null; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend health check failed${NC}"
    fi
    
    # Check database connection
    if $cmd exec postgres pg_isready 2>/dev/null; then
        echo -e "${GREEN}✅ Database is ready${NC}"
    else
        echo -e "${YELLOW}⚠️  Database is not ready${NC}"
    fi
}

# Main script logic
main() {
    # Show help if no arguments
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi
    
    # Parse arguments
    case $1 in
        -h|--help|help)
            show_help
            exit 0
            ;;
        health)
            if [ -n "$2" ]; then
                validate_environment "$2"
                setup_env_file
                health_check
            else
                echo -e "${RED}Error: Environment required for health check${NC}"
                exit 1
            fi
            exit 0
            ;;
        *)
            validate_environment "$1"
            ACTION="$2"
            
            if [ -z "$ACTION" ]; then
                echo -e "${RED}Error: Action required${NC}"
                show_help
                exit 1
            fi
            ;;
    esac
    
    # Setup environment file
    setup_env_file
    
    # Execute action
    execute_action "$@"
}

# Run main function
main "$@"