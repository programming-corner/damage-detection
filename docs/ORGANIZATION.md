# 📁 Project Organization

This document describes the reorganized project structure for the Damage Detection System.

## 🏗️ New Structure

The project has been reorganized from a single frontend repository to a full-stack monorepo structure:

```
damage-detection/                    # Root project directory
├── .git/                           # Git repository (moved from frontend)
├── README.md                       # Main project documentation
├── docs/                          # Shared documentation
│   └── ORGANIZATION.md            # This file
├── damage-detection-frontend/      # React Native app (moved from root)
│   ├── src/                       # Frontend source code
│   ├── docker/                    # Docker configuration
│   ├── scripts/                   # Setup and build scripts
│   ├── config/                    # Configuration files
│   ├── docs/                      # Frontend-specific docs
│   ├── package.json              # Frontend dependencies
│   └── README.md                  # Frontend setup guide
└── damage-detection-backend/       # Node.js API server (new)
    ├── src/                       # Backend source code (planned)
    ├── tests/                     # Backend tests (planned)
    ├── docs/                      # Backend API docs (planned)
    ├── package.json              # Backend dependencies (planned)
    └── README.md                  # Backend setup guide
```

## 🔄 Migration Summary

### What Was Moved
1. **Git Repository**: Moved from `damage-detection-frontend/.git` to root `damage-detection/.git`
2. **Frontend Code**: Moved from root to `damage-detection-frontend/` subdirectory
3. **Documentation**: Reorganized and updated for monorepo structure

### What Was Created
1. **Root README.md**: New overview for the entire project
2. **Backend Directory**: `damage-detection-backend/` with initial structure
3. **Shared Documentation**: `docs/` folder for project-wide documentation

## 🚀 Benefits of New Structure

### 1. **Scalability**
- Easy to add new services (admin dashboard, mobile API, etc.)
- Clear separation between frontend and backend concerns
- Room for microservices architecture in the future

### 2. **Development Workflow**
- Single Git repository for the entire project
- Coordinated releases between frontend and backend
- Shared documentation and configuration

### 3. **Deployment**
- Independent deployment of frontend and backend
- Docker compose for full-stack development
- CI/CD pipelines can target specific components

## 📋 Development Commands

### Root Level
```bash
# Clone the project
git clone https://github.com/alaahayba/damage-detection.git
cd damage-detection

# Start full development environment (planned)
docker-compose up

# Run tests for all components (planned)
npm run test:all
```

### Frontend Development
```bash
cd damage-detection-frontend
npm install
npm run web              # Web development
npm run android          # Android development
npm run ios             # iOS development
```

### Backend Development
```bash
cd damage-detection-backend
npm install              # Install dependencies (planned)
npm run dev             # Start development server (planned)
npm test                # Run tests (planned)
```

## 🔧 Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical fixes

### Commit Conventions
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `test:` - Test additions/updates

### Example Workflow
```bash
# Create a feature branch
git checkout -b feature/user-authentication

# Make changes in frontend
cd damage-detection-frontend
# ... make changes ...
git add damage-detection-frontend/
git commit -m "feat: add user login screen"

# Make changes in backend
cd ../damage-detection-backend
# ... make changes ...
git add damage-detection-backend/
git commit -m "feat: implement JWT authentication API"

# Push and create pull request
git push origin feature/user-authentication
```

## 📚 Next Steps

1. **Backend Implementation**: Set up Express.js server with basic CRUD operations
2. **Database Setup**: Configure PostgreSQL with Prisma ORM
3. **API Integration**: Connect frontend to backend APIs
4. **Docker Compose**: Create full-stack development environment
5. **CI/CD Pipeline**: Set up automated testing and deployment
6. **Documentation**: Expand API documentation and guides

This reorganization sets the foundation for a professional, scalable full-stack application.