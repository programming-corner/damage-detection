# Unified Docker Compose Guide

This project uses a unified Docker Compose configuration that handles all environments (development, production, and testing) using profiles and environment variables.

## 📁 File Structure

```
damage-detection/
├── docker-compose.unified.yml      # Main Docker Compose file
├── docker-manage.sh               # Management script
├── env.examples/                  # Environment file templates
│   ├── .env.development.example   # Development environment template
│   ├── .env.production.example    # Production environment template  
│   └── .env.test.example         # Test environment template
├── .env.development              # Your development config (git-ignored)
├── .env.production               # Your production config (git-ignored)
└── .env.test                     # Your test config (git-ignored)
```

## 🚀 Quick Start

### 1. Setup Environment Files

```bash
# Copy example files to actual environment files
cp env.examples/.env.development.example .env.development
cp env.examples/.env.production.example .env.production
cp env.examples/.env.test.example .env.test

# Edit the files with your specific configuration
nano .env.development
```

### 2. Use the Management Script

```bash
# Make script executable (first time only)
chmod +x docker-manage.sh

# Start development environment
./docker-manage.sh dev up

# Start production environment in background
./docker-manage.sh prod up -d

# View logs
./docker-manage.sh dev logs backend

# Open shell in backend container
./docker-manage.sh dev shell
```

## 🔧 Environment Configurations

### Development Environment

**Profile**: `dev` or `development`

**Services**:
- Frontend (development build with hot reload)
- Backend (with volume mounting for code changes)
- PostgreSQL
- Redis

**Features**:
- Hot reload for both frontend and backend
- Source code volume mounting
- Development-friendly logging
- Exposed ports for debugging

```bash
# Start development environment
./docker-manage.sh dev up

# View backend logs
./docker-manage.sh dev logs backend -f

# Run tests in development
./docker-manage.sh dev exec backend npm test
```

### Production Environment

**Profile**: `prod` or `production`

**Services**:
- Frontend (optimized production build)
- Backend (production build)
- PostgreSQL (with security settings)
- Redis (with authentication)
- Nginx (reverse proxy with SSL)

**Features**:
- Optimized builds
- Security hardened
- SSL/TLS support
- Health checks
- Restart policies

```bash
# Start production environment
./docker-manage.sh prod up -d

# Check health status
./docker-manage.sh health prod

# View nginx logs
./docker-manage.sh prod logs nginx
```

### Test Environment

**Profile**: `test`

**Services**:
- Backend (test configuration)
- PostgreSQL (test database)
- Redis (test instance)

**Features**:
- Isolated test database
- Silent logging
- Test-specific ports

```bash
# Run tests
./docker-manage.sh test up

# Run database migrations for tests
./docker-manage.sh test migrate
```

## 📋 Available Commands

### Management Script Usage

```bash
./docker-manage.sh [ENVIRONMENT] [ACTION] [OPTIONS]
```

### Environments
- `dev`, `development` - Development with hot reload
- `prod`, `production` - Production environment  
- `test` - Testing environment

### Actions

| Action | Description | Example |
|--------|-------------|---------|
| `up` | Start services | `./docker-manage.sh dev up` |
| `down` | Stop services | `./docker-manage.sh dev down` |
| `build` | Build images | `./docker-manage.sh dev build` |
| `logs` | View logs | `./docker-manage.sh dev logs backend` |
| `ps` | List containers | `./docker-manage.sh dev ps` |
| `exec` | Execute command | `./docker-manage.sh dev exec backend bash` |
| `shell` | Open backend shell | `./docker-manage.sh dev shell` |
| `clean` | Remove everything | `./docker-manage.sh dev clean` |
| `migrate` | Run migrations | `./docker-manage.sh dev migrate` |
| `seed` | Seed database | `./docker-manage.sh dev seed` |

### Direct Docker Compose Usage

If you prefer using Docker Compose directly:

```bash
# Development
docker-compose -f docker-compose.unified.yml --env-file .env.development --profile dev up

# Production  
docker-compose -f docker-compose.unified.yml --env-file .env.production --profile prod up -d

# Test
docker-compose -f docker-compose.unified.yml --env-file .env.test --profile test up
```

## 🔐 Environment Variables

### Key Variables

| Variable | Development | Production | Test |
|----------|-------------|------------|------|
| `NODE_ENV` | development | production | test |
| `POSTGRES_PASSWORD` | dev_password | **SECURE_PASSWORD** | test_password |
| `JWT_SECRET` | dev-secret | **SECURE_32_CHAR_SECRET** | test-secret |
| `REDIS_PASSWORD` | _(empty)_ | **SECURE_PASSWORD** | _(empty)_ |

### Security Notes

⚠️ **Important**: Always change default passwords in production!

- Update `POSTGRES_PASSWORD` with a secure password
- Update `JWT_SECRET` with a secure random string (minimum 32 characters)
- Update `REDIS_PASSWORD` with a secure password
- Never commit actual `.env` files to git

## 🏗️ Service Profiles

### Development Profile (`dev`)
```yaml
services:
  frontend-dev     # React Native with hot reload
  backend          # NestJS with volume mounting  
  postgres         # PostgreSQL
  redis           # Redis cache
```

### Production Profile (`prod`)
```yaml
services:
  frontend-prod    # Optimized React Native build
  backend          # Production NestJS build
  postgres         # PostgreSQL with security
  redis           # Redis with auth
  nginx           # Reverse proxy with SSL
```

### Test Profile (`test`)
```yaml
services:
  backend          # Test configuration
  postgres         # Test database
  redis           # Test cache
```

## 🔍 Monitoring & Health Checks

### Health Checks

The configuration includes health checks for all services:

```bash
# Check overall system health
./docker-manage.sh health dev

# Manual health checks
curl http://localhost:3001/health          # Backend
docker exec postgres pg_isready           # Database
docker exec redis redis-cli ping          # Redis
```

### Logging

```bash
# View all logs
./docker-manage.sh dev logs

# Follow specific service logs
./docker-manage.sh dev logs backend -f

# View last 100 lines
./docker-manage.sh dev logs --tail=100
```

## 🗄️ Database Management

### Migrations

```bash
# Run migrations
./docker-manage.sh dev migrate

# Create new migration
./docker-manage.sh dev exec backend npm run migration:create

# Revert migration
./docker-manage.sh dev exec backend npm run migration:revert
```

### Database Access

```bash
# Connect to database
./docker-manage.sh dev exec postgres psql -U dev_user -d damage_detection_dev_db

# Backup database
./docker-manage.sh dev exec postgres pg_dump -U dev_user damage_detection_dev_db > backup.sql

# Restore database
./docker-manage.sh dev exec postgres psql -U dev_user damage_detection_dev_db < backup.sql
```

## 🧹 Cleanup & Maintenance

### Clean Development Environment

```bash
# Stop and remove containers
./docker-manage.sh dev down

# Remove all containers, networks, and volumes
./docker-manage.sh dev clean

# Rebuild everything
./docker-manage.sh dev build --no-cache
./docker-manage.sh dev up
```

### Docker System Cleanup

```bash
# Remove unused containers, networks, images
docker system prune -f

# Remove unused volumes
docker volume prune -f

# Remove everything (use with caution!)
docker system prune -a --volumes -f
```

## 🚨 Troubleshooting

### Common Issues

**Port conflicts**:
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process using port
kill -9 $(lsof -t -i:3000)
```

**Database connection issues**:
```bash
# Check database logs
./docker-manage.sh dev logs postgres

# Test database connection
./docker-manage.sh dev exec backend npm run db:test
```

**Permission issues**:
```bash
# Fix upload directory permissions
sudo chown -R $USER:$USER ./uploads
```

### Reset Everything

```bash
# Nuclear option - reset everything
./docker-manage.sh dev clean
docker system prune -a --volumes -f
./docker-manage.sh dev build --no-cache
./docker-manage.sh dev up
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Compose Profiles](https://docs.docker.com/compose/profiles/)
- [Environment Variables in Compose](https://docs.docker.com/compose/environment-variables/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)