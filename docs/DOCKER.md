# 🐳 Docker Setup for Damage Detection App

## Overview
This React Native app is fully dockerized for both development and production environments. Docker provides consistent environments across different machines and simplifies deployment.

## 📁 Docker Files Structure

```
damage-detection-frontend/
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Development environment
├── docker-compose.prod.yml # Production environment
├── .dockerignore           # Files to exclude from Docker build
├── .env.development        # Development environment variables
├── .env.production         # Production environment variables
└── docker-dev.sh          # Development helper script
```

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Development Setup

1. **Build and start the development environment:**
   ```bash
   ./docker-dev.sh start
   ```

2. **View the app:**
   - Metro bundler: http://localhost:8081
   - Development server: http://localhost:3000

3. **View logs:**
   ```bash
   ./docker-dev.sh logs
   ```

## 🛠️ Development Commands

### Using Helper Script
```bash
./docker-dev.sh build     # Build Docker images
./docker-dev.sh start     # Start development environment
./docker-dev.sh stop      # Stop all services
./docker-dev.sh restart   # Restart services
./docker-dev.sh logs      # Show app logs
./docker-dev.sh shell     # Open shell in container
./docker-dev.sh clean     # Clean up Docker resources
./docker-dev.sh install   # Install npm packages
./docker-dev.sh status    # Show services status
```

### Manual Docker Commands
```bash
# Build development image
docker-compose build

# Start development environment
docker-compose up -d

# Stop environment
docker-compose down

# View logs
docker-compose logs -f react-native-app

# Execute commands in container
docker-compose exec react-native-app npm install
docker-compose exec react-native-app npx react-native start
```

## 📱 Mobile Development with Docker

### Connecting Physical Devices

#### Android
```bash
# Enable ADB over network
adb tcpip 5555
adb connect <DEVICE_IP>:5555

# Run in container
docker-compose exec react-native-app npx react-native run-android
```

#### iOS (macOS Host Required)
```bash
# iOS development requires Xcode and macOS
# Run outside container for iOS builds
npx react-native run-ios
```

### Simulator/Emulator Setup
```bash
# Android Emulator (must be running on host)
# Set ANDROID_HOME in container to point to host
docker-compose exec react-native-app npx react-native run-android

# iOS Simulator (macOS only, run on host)
npx react-native run-ios
```

## 🏭 Production Deployment

### Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d
```

### Production Environment Includes:
- React Native Metro bundler
- Backend API service (if backend is dockerized)
- PostgreSQL database
- Redis cache
- Nginx reverse proxy

### Environment Variables for Production
Create `.env.production` with:
```bash
NODE_ENV=production
API_BASE_URL=https://your-api-domain.com/api
DATABASE_URL=postgresql://user:pass@postgres:5432/damage_db
JWT_SECRET=your-super-secure-secret
GCS_BUCKET=your-cloud-storage-bucket
```

## 🔧 Configuration

### Network Configuration
The Docker setup creates an isolated network where services can communicate:
- `react-native-app` ↔ `backend` ↔ `postgres` ↔ `redis`

### Port Mapping
- **8081**: Metro bundler (React Native)
- **3000**: Development server
- **5432**: PostgreSQL database
- **6379**: Redis cache
- **80/443**: Nginx (production)

### Volume Mounts
Development mode mounts source code for hot reload:
```yaml
volumes:
  - .:/app                    # Source code
  - /app/node_modules         # Preserve node_modules
```

## 📱 Mobile App Connection

### Development
The app connects to dockerized services via:
```typescript
// In src/services/api.ts
const API_BASE_URL = __DEV__ 
  ? 'http://host.docker.internal:3000/api'  // Docker host
  : 'https://your-api-domain.com/api';      // Production
```

### Device Connection
- **Android Emulator**: Can connect to `10.0.2.2:3000`
- **Physical Android**: Use computer's IP address
- **iOS Simulator**: Can connect to `localhost:3000`
- **Physical iOS**: Use computer's IP address

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler not accessible:**
   ```bash
   # Ensure correct hostname binding
   REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
   ```

2. **Cannot connect to API:**
   ```bash
   # Use host.docker.internal for Docker Desktop
   # Or use host IP address for physical devices
   ```

3. **Node modules issues:**
   ```bash
   ./docker-dev.sh clean
   ./docker-dev.sh build
   ```

4. **Performance issues:**
   ```bash
   # Increase Docker memory allocation
   # Docker Desktop > Settings > Resources > Memory
   ```

### Debugging
```bash
# Access container shell
docker-compose exec react-native-app sh

# Check running processes
docker-compose ps

# View detailed logs
docker-compose logs --follow react-native-app

# Check network connectivity
docker-compose exec react-native-app ping backend
```

## 🔍 Health Checks

### Development Health Check
```bash
curl http://localhost:8081/status
curl http://localhost:3000/api/health
```

### Production Monitoring
```bash
docker-compose -f docker-compose.prod.yml ps
docker stats
```

## 📦 Building for Release

### Android APK in Docker
```bash
docker-compose exec react-native-app npx react-native build-android --mode=release
```

### iOS Build (macOS Host Required)
```bash
# iOS builds must run on macOS host
npx react-native build-ios --mode=Release
```

## 🚀 Deployment Options

### Cloud Deployment
1. **Google Cloud Run**: Deploy Metro bundler container
2. **AWS ECS**: Container orchestration
3. **Azure Container Instances**: Simple container deployment
4. **DigitalOcean Apps**: Platform-as-a-service deployment

### CI/CD Pipeline
```yaml
# Example GitHub Actions
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t damage-detection-app .
      - name: Deploy to production
        run: docker-compose -f docker-compose.prod.yml up -d
```

## 💡 Best Practices

1. **Use multi-stage builds** for smaller production images
2. **Pin dependency versions** in package.json
3. **Use .dockerignore** to exclude unnecessary files
4. **Set resource limits** in production
5. **Use secrets management** for sensitive data
6. **Monitor container health** and performance
7. **Backup persistent volumes** (database, uploads)

This Docker setup provides a complete development environment that matches production, making deployment reliable and development consistent across teams! 🎉