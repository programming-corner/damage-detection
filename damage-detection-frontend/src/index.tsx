import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native-web';
import SimpleWebApp from './SimpleWebApp.jsx';

// Register the app
AppRegistry.registerComponent('DamageDetectionApp', () => SimpleWebApp);

// Get the root element
const container = document.getElementById('root');
if (container) {
  createRoot(container);
  
  // Start the app
  AppRegistry.runApplication('DamageDetectionApp', {
    rootTag: container,
  });
} else {
  console.error('Root container not found');
}