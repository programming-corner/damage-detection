# 🏪 Store Management System

A comprehensive React Native application for grocery store incident reporting and facilities management.

## 📁 Project Structure

```
damage-detection-frontend/
├── 📂 src/                     # Source code
│   ├── 📂 components/          # Reusable UI components
│   ├── 📂 screens/            # Screen components
│   ├── 📂 navigation/         # Navigation setup
│   ├── 📂 store/             # Redux store configuration
│   ├── 📂 services/          # API services and utilities
│   └── 📂 theme/             # Styling and theming
├── 📂 docker/                 # Docker configuration
│   ├── Dockerfile             # Production Docker image
│   ├── Dockerfile.dev         # Development Docker image
│   ├── docker-compose.yml     # Development compose
│   ├── docker-compose.prod.yml # Production compose
│   ├── .dockerignore          # Docker ignore file
│   ├── docker-dev.sh          # Docker helper script
│   └── test-docker.sh         # Docker testing script
├── 📂 scripts/               # Build and setup scripts
│   ├── setup.sh              # Main setup script
│   └── quick-web.sh          # Quick web development setup
├── 📂 config/                # Configuration files
│   ├── .env                  # Default environment variables
│   ├── .env.development      # Development environment
│   └── .env.production       # Production environment
├── 📂 docs/                  # Documentation
│   ├── SETUP-COMPLETE.md     # Setup completion guide
│   ├── DOCKER.md             # Docker documentation
│   └── QUICKSTART.md         # Quick start guide
├── 📂 public/                # Public web assets
├── 📄 package.json           # Node.js dependencies and scripts
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 vite.config.ts         # Vite configuration for web
├── 📄 index.html             # Web entry point
└── 📄 README.md              # This file
```

## 🚀 Quick Start Commands

### Setup
```bash
# Choose your platform
npm run setup:web      # Web development
npm run setup:android  # Android development  
npm run setup:ios      # iOS development
npm run setup          # Interactive menu
```

### Development
```bash
npm run web            # Start web development server
npm start              # Start React Native Metro bundler
npm run android        # Run on Android device/emulator
npm run ios            # Run on iOS simulator
```

### Docker
```bash
npm run docker:build  # Build Docker images
npm run docker:start  # Start development environment
npm run docker:stop   # Stop all services
npm run docker:dev    # Docker development helper
```

### Building
```bash
npm run build:web      # Build web application
npm run build:android  # Build Android APK
npm run build:ios      # Build iOS app
```

## 🏪 Features

### 📋 Incident Reporting
- Photo evidence capture (camera/upload)
- Categorized damage types (Product, Equipment, Facilities)
- Severity classification (Low/Medium/High/Critical)
- Location tracking and batch identification
- Status management (Open/In Progress/Resolved)

### 📱 Cross-Platform
- **Web**: Vite-powered development with React Native Web
- **Android**: Native Android app via React Native
- **iOS**: Native iOS app via React Native (macOS required)

### 🔧 Categories
- **Product Damage**: Damaged inventory, spoiled goods
- **Batch/Inventory**: Batch recalls, expiration issues
- **Kitchen Equipment**: Coffee machines, food prep equipment
- **Refrigeration**: Freezers, refrigerators, temperature alerts
- **HVAC System**: Heating, ventilation, air conditioning
- **Roof/Building**: Structural issues, leaks, maintenance
- **Electrical**: Power issues, lighting systems
- **Plumbing**: Water systems, drainage
- **Safety Equipment**: Fire equipment, first aid stations

## 📚 Documentation

- [Setup Guide](docs/SETUP-COMPLETE.md) - Complete setup instructions
- [Docker Guide](docs/DOCKER.md) - Docker deployment and development
- [Quick Start](docs/QUICKSTART.md) - Get up and running quickly

## 🛠 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Platform-specific tools (Android SDK, Xcode for iOS)

### Environment Setup
1. Copy environment template: `cp config/.env.example config/.env`
2. Configure your environment variables
3. Run setup script: `npm run setup`

### File Organization
- Keep Docker files in `docker/` folder
- Store scripts in `scripts/` folder  
- Put documentation in `docs/` folder
- Environment configs in `config/` folder
- Source code organized in `src/` folder

## 🎯 Usage

1. **Start Development**: `npm run web` for immediate testing
2. **Add Reports**: Click "Add New Report" to document incidents
3. **Capture Evidence**: Use camera or file upload for photos
4. **Categorize Issues**: Select appropriate damage category
5. **Track Status**: Monitor resolution progress
6. **Export Data**: Generate reports for management

---

**Built with React Native • Designed for grocery store operations • Cross-platform ready**