#!/bin/bash

# Damage Detection App Setup Script
echo "🚀 Setting up Damage Detection React Native App..."

# Parse command line arguments
PLATFORM=""
case "$1" in
    "web")
        PLATFORM="web"
        echo "🌐 Setting up for Web development"
        ;;
    "android")
        PLATFORM="android"
        echo "🤖 Setting up for Android development"
        ;;
    "ios")
        PLATFORM="ios"
        echo "📱 Setting up for iOS development"
        ;;
    "all")
        PLATFORM="all"
        echo "📱🤖🌐 Setting up for all platforms"
        ;;
    "")
        echo "📋 Usage: ./setup.sh [platform]"
        echo "   web     - Setup for web development (fastest)"
        echo "   android - Setup for Android development"
        echo "   ios     - Setup for iOS development (macOS only)"
        echo "   all     - Setup for all platforms"
        echo ""
        echo "❓ Which platform would you like to set up for?"
        echo "1) Web (recommended for getting started)"
        echo "2) Android"
        echo "3) iOS (macOS only)"
        echo "4) All platforms"
        read -p "Choose (1-4): " choice
        
        case $choice in
            1) PLATFORM="web" ;;
            2) PLATFORM="android" ;;
            3) PLATFORM="ios" ;;
            4) PLATFORM="all" ;;
            *) echo "❌ Invalid choice. Defaulting to web."; PLATFORM="web" ;;
        esac
        ;;
    *)
        echo "❌ Unknown platform: $1"
        echo "Valid options: web, android, ios, all"
        exit 1
        ;;
esac

echo "🎯 Target platform: $PLATFORM"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if we're on macOS for iOS development
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "✅ macOS detected - iOS development available"
    IOS_AVAILABLE=true
else
    echo "ℹ️  Non-macOS system - Android and Web only"
    IOS_AVAILABLE=false
    
    # Override iOS choice if not on macOS
    if [[ "$PLATFORM" == "ios" ]]; then
        echo "❌ iOS development requires macOS. Switching to web platform."
        PLATFORM="web"
    fi
fi

# Install React Native CLI if needed (skip for web-only)
if [[ "$PLATFORM" != "web" ]]; then
    if ! command -v npx react-native &> /dev/null; then
        echo "📦 Installing React Native CLI..."
        npm install -g @react-native-community/cli
    fi
fi

# Install dependencies
echo "📦 Installing npm dependencies..."

# Install base React Native dependencies if needed
if [[ "$PLATFORM" == "web" ]]; then
    echo "🌐 Installing web-only dependencies..."
    npm install react-native-web react-scripts react-dom --legacy-peer-deps
else
    echo "📱 Installing full React Native dependencies..."
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Please check your network connection and try again."
    exit 1
fi

# iOS setup (macOS only)
if [[ ("$PLATFORM" == "ios" || "$PLATFORM" == "all") && "$IOS_AVAILABLE" == true ]]; then
    echo "📱 Setting up iOS dependencies..."
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo "📦 Installing CocoaPods..."
        sudo gem install cocoapods
    fi
    
    # Initialize React Native iOS project if it doesn't exist
    if [ ! -d "ios" ]; then
        echo "🏗️  Initializing React Native iOS project..."
        npx react-native init TempProject --template react-native-template-typescript
        mv TempProject/ios ./
        rm -rf TempProject
    fi
    
    echo "📦 Installing iOS pods..."
    cd ios && pod install && cd ..
    
    if [ $? -eq 0 ]; then
        echo "✅ iOS setup completed"
    else
        echo "⚠️  iOS setup had issues. You may need to run 'cd ios && pod install' manually."
    fi
elif [[ "$PLATFORM" == "ios" ]]; then
    echo "⚠️  iOS setup skipped - not available on this platform"
fi

# Android setup check
if [[ ("$PLATFORM" == "android" || "$PLATFORM" == "all") ]]; then
    echo "🤖 Checking Android development environment..."

    if command -v adb &> /dev/null; then
        echo "✅ Android SDK detected"
    else
        echo "⚠️  Android SDK not found. Please install Android Studio and configure SDK."
        echo "📚 See: https://reactnative.dev/docs/environment-setup"
    fi

    # Check for Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n1 | cut -d'"' -f2 | cut -d'.' -f1)
        if [ "$JAVA_VERSION" -ge 11 ] 2>/dev/null; then
            echo "✅ Java $JAVA_VERSION detected"
        else
            echo "⚠️  Java 11+ recommended. Current version: $JAVA_VERSION"
        fi
    else
        echo "⚠️  Java not found. Please install Java 11+ JDK."
    fi
    
    # Initialize React Native Android project if it doesn't exist
    if [ ! -d "android" ]; then
        echo "🏗️  Initializing React Native Android project..."
        npx react-native init TempProject --template react-native-template-typescript
        mv TempProject/android ./
        rm -rf TempProject
    fi
elif [[ "$PLATFORM" == "web" ]]; then
    echo "🌐 Web platform selected - skipping mobile setup"
fi

# Create environment configuration
echo "⚙️  Creating environment configuration..."

cat > .env << EOL
# Damage Detection App Configuration
API_BASE_URL_DEV=http://localhost:3000/api
API_BASE_URL_PROD=https://your-api-domain.com/api
EOL

echo "✅ Environment file created (.env)"

# Setup complete
echo ""
echo "🎉 Setup completed successfully for $PLATFORM!"
echo ""
echo "📱 Next steps:"
echo "1. Configure your backend API URL in src/services/api.ts"
echo ""

case "$PLATFORM" in
    "web")
        echo "🌐 Web Development:"
        echo "   npm run web            # Start web version at http://localhost:3000"
        echo ""
        echo "🚀 Quick start:"
        echo "   npm run web"
        ;;
    "android")
        echo "🤖 Android Development:"
        echo "   npm start              # Start Metro bundler (in one terminal)"
        echo "   npx react-native run-android # Run on Android (in another terminal)"
        echo ""
        echo "🚀 Quick start:"
        echo "   npm start &"
        echo "   npx react-native run-android"
        ;;
    "ios")
        if [ "$IOS_AVAILABLE" = true ]; then
            echo "📱 iOS Development:"
            echo "   npm start              # Start Metro bundler (in one terminal)"
            echo "   npx react-native run-ios # Run on iOS (in another terminal)"
            echo ""
            echo "🚀 Quick start:"
            echo "   npm start &"
            echo "   npx react-native run-ios"
        else
            echo "❌ iOS development not available on this platform"
        fi
        ;;
    "all")
        echo "🌐 Web Development:"
        echo "   npm run web            # Start web version at http://localhost:3000"
        echo ""
        echo "📱 Mobile Development:"
        echo "   npm start              # Start Metro bundler"
        if [ "$IOS_AVAILABLE" = true ]; then
            echo "   npx react-native run-ios     # Run on iOS"
        fi
        echo "   npx react-native run-android # Run on Android"
        echo ""
        echo "� Quick start (web - easiest):"
        echo "   npm run web"
        ;;
esac

echo ""
echo "�📚 See README.md for detailed instructions"
echo "🐛 For troubleshooting mobile development, run: npx react-native doctor"