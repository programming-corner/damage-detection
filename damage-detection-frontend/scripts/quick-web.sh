#!/bin/bash

# Quick Web Setup Script
echo "🌐 Quick Web Setup for Damage Detection App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install minimal dependencies for web
echo "📦 Installing web dependencies..."
npm install react-native-web react-scripts react-dom @types/react @types/react-dom --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Installation failed. Please check your network connection and try again."
    exit 1
fi

echo "✅ Dependencies installed"

# Start web development server
echo "🚀 Starting web development server..."
echo "📱 The app will open at http://localhost:3000"
echo ""
npm run web