# 🏪 Store Management System

A comprehensive React Native application for grocery store incident reporting and facilities management.

## 🚀 Quick Start

```bash
# Setup for your platform
npm run setup:web      # Web development (fastest)
npm run setup:android  # Android development  
npm run setup:ios      # iOS development
npm run setup          # Interactive platform selection

# Start development
npm run web            # Start web app
npm start              # Start React Native Metro bundler
```

### Prerequisites

1. **Node.js** (v16 or higher)
   ```bash
   # Check your version
   node --version
   npm --version
   ```

2. **React Native CLI**
   ```bash
   npm install -g @react-native-community/cli
   ```

3. **Platform-specific requirements:**

   **For iOS:**
   - Xcode 12+ (macOS only)
   - iOS Simulator
   - CocoaPods: `sudo gem install cocoapods`

   **For Android:**
   - Android Studio
   - Android SDK (API level 28+)
   - Java 11 JDK

### 🛠️ Installation Steps

#### Option 1: Platform-Specific Setup (Recommended)
Choose your target platform for faster setup:

```bash
cd damage-detection-frontend

# Web development (fastest, no mobile setup needed)
./setup.sh web

# Android development
./setup.sh android

# iOS development (macOS only)  
./setup.sh ios

# All platforms
./setup.sh all
```

#### Option 2: Super Quick Web Start
```bash
cd damage-detection-frontend
./quick-web.sh  # Installs minimal deps and starts web server
```

#### Option 3: Docker Setup
```bash
cd damage-detection-frontend
./docker-dev.sh start
```

#### Option 4: Manual Setup
1. **Navigate to the frontend directory:**
   ```bash
   cd damage-detection-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Android Setup:**
   ```bash
   # Make sure Android SDK is properly configured
   npx react-native doctor
   ```

### 🏃‍♂️ Running the App

#### Web Development (Fastest)
```bash
# After running ./setup.sh web
npm run web

# App will be available at http://localhost:3000
```

#### With Docker
```bash
# Start development environment
./docker-dev.sh start

# View logs
./docker-dev.sh logs

# Stop when done
./docker-dev.sh stop
```

#### Mobile Development
##### iOS (macOS only)
```bash
# After running ./setup.sh ios or ./setup.sh all
npm start              # Terminal 1: Start Metro
npx react-native run-ios  # Terminal 2: Run iOS
```

##### Android
```bash
# After running ./setup.sh android or ./setup.sh all
npm start                  # Terminal 1: Start Metro
npx react-native run-android  # Terminal 2: Run Android
```

### 📱 Main Features

1. **Authentication**
   - JWT-based login system
   - Secure token storage

2. **Camera Functionality**
   - Native camera integration
   - Image capture with metadata
   - GPS location tracking
   - EXIF data preservation

3. **Damage Reporting**
   - Item SKU input
   - Multiple image capture
   - Real-time location tracking
   - Progress tracking during upload

4. **Dashboard**
   - Report statistics
   - Recent reports overview
   - Quick actions

5. **Reports Management**
   - List all reports
   - Search and filter
   - Status tracking (Pending/Confirmed/Rejected)

### 🔧 Configuration

#### Docker Configuration
The app is fully dockerized for consistent development:
- `./docker-dev.sh start` - Start development environment
- `./docker-dev.sh logs` - View application logs
- `./docker-dev.sh shell` - Access container shell

See [DOCKER.md](./DOCKER.md) for complete Docker documentation.

#### API Configuration
Edit `src/services/api.ts` to set your backend URL:
```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'           // Development (native)
  : 'https://your-api-domain.com/api';    // Production
```

For Docker development:
```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://host.docker.internal:3001/api'  // Docker development
  : 'https://your-api-domain.com/api';      // Production
```

### 📁 Project Structure

```
src/
├── components/          # Reusable components
├── navigation/          # Navigation configuration
├── screens/            # Screen components
│   ├── auth/           # Login screens
│   ├── camera/         # Camera and capture
│   ├── dashboard/      # Dashboard screen
│   ├── reports/        # Reports management
│   └── profile/        # User profile
├── services/           # API services
├── store/              # Redux store and slices
├── theme/              # Theme configuration
└── utils/              # Utility functions
```

### 🎨 Key Components

1. **CameraScreen** - Main functionality for damage capture
2. **LoginScreen** - User authentication
3. **DashboardScreen** - Overview and statistics
4. **ReportsListScreen** - Reports management

### 🔐 Security Features

- JWT authentication
- Secure token storage
- Image metadata validation
- Location verification
- Offline capability preparation

### 📦 Dependencies

Key libraries used:
- `react-navigation` - Navigation system
- `react-native-paper` - Material Design components
- `@reduxjs/toolkit` - State management
- `react-native-image-picker` - Camera functionality
- `react-native-geolocation-service` - GPS tracking
- `react-native-permissions` - Permission handling
- `axios` - HTTP client

### 🛠️ Development Tips

1. **Hot Reload:** Changes are reflected immediately
2. **Debugging:** Use React Native Debugger or Flipper
3. **Testing:** Run `npm test` for unit tests
4. **Linting:** Run `npm run lint` to check code quality

### 🚀 Building for Production

#### Android
```bash
cd android
./gradlew assembleRelease
```

#### iOS
```bash
cd ios
xcodebuild -workspace DamageDetectionApp.xcworkspace -scheme DamageDetectionApp -configuration Release
```

### 🐛 Troubleshooting

1. **Metro bundler issues:**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues:**
   ```bash
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

3. **iOS build issues:**
   ```bash
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

4. **Permission issues:**
   - Check device settings
   - Reinstall app if needed

### 🔧 Next Steps

After successful setup, you can:
1. Connect to your backend API
2. Test camera functionality
3. Implement additional features
4. Deploy to app stores

### 💡 Framework Choice: React Native

**Why React Native?**
- ✅ Single codebase for iOS and Android
- ✅ Native performance
- ✅ Rich ecosystem
- ✅ Hot reload for fast development
- ✅ Excellent camera and location APIs
- ✅ Great for enterprise apps

**Alternative Frameworks Considered:**
- **Flutter**: Good but Dart learning curve
- **Ionic**: Web-based, less native feel
- **Native**: Separate codebases for iOS/Android

React Native provides the best balance of development speed, performance, and native device access needed for this damage detection app.