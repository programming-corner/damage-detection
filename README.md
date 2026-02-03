# 🏪 Damage Detection System

A full-stack application for grocery store incident reporting and facilities management.

## 📁 Project Structure

```
damage-detection/
├── damage-detection-frontend/     # React Native mobile & web app
├── damage-detection-backend/      # Node.js/Express API server
├── README.md                      # This file
└── docs/                         # Shared documentation
```

## 🚀 Quick Start

### Frontend (React Native + Web)
```bash
cd damage-detection-frontend
npm install
npm run web              # Start web development server
npm run android          # Run on Android
npm run ios             # Run on iOS (macOS only)
```

### Backend (Coming Soon)
```bash
cd damage-detection-backend
npm install
npm run dev             # Start development server
```

## 🔧 Development

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **React Native CLI** (for mobile development)

### Platform-Specific Requirements

**iOS Development:**
- macOS with Xcode 12+
- iOS Simulator
- CocoaPods: `sudo gem install cocoapods`

**Android Development:**
- Android Studio
- Android SDK (API level 28+)
- Java 11 JDK

## 📋 Features

### Current (Frontend)
- ✅ **Cross-Platform**: React Native app running on iOS, Android, and Web
- ✅ **Incident Reporting**: Photo capture and detailed damage reports
- ✅ **Store Categories**: Product Damage, Kitchen Equipment, Refrigeration, etc.
- ✅ **Authentication**: User login and profile management
- ✅ **Dashboard**: Real-time incident statistics and management
- ✅ **Docker Support**: Containerized development environment

### Planned (Backend)
- 🔲 **REST API**: Node.js/Express server
- 🔲 **Database**: PostgreSQL/MongoDB for data storage
- 🔲 **Authentication**: JWT-based user authentication
- 🔲 **File Upload**: Image storage and processing
- 🔲 **Real-time Updates**: WebSocket support for live updates
- 🔲 **Analytics**: Incident reporting and analytics dashboard

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  React Native   │    │   Express API   │    │   PostgreSQL    │
│   Frontend      │◄──►│    Backend      │◄──►│   Database      │
│   (Web/Mobile)  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📖 Documentation

- [Frontend Setup](./damage-detection-frontend/README.md) - Detailed React Native setup
- [Docker Guide](./damage-detection-frontend/docs/DOCKER.md) - Containerization
- [Quick Start](./damage-detection-frontend/docs/QUICKSTART.md) - Get running fast

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Repository

[GitHub Repository](https://github.com/alaahayba/damage-detection)