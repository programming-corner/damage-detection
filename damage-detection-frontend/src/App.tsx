import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Platform, View, StyleSheet} from 'react-native';
import {store} from './store/store';
import AppNavigator from './navigation/AppNavigator';
import {theme} from './theme/theme';

// Simple web-compatible version for demonstration
const SimpleWebApp: React.FC = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <View style={styles.webContainer}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </View>
      </PaperProvider>
    </Provider>
  );
};

const App: React.FC = () => {
  // Use simplified version for web
  if (Platform.OS === 'web') {
    return <SimpleWebApp />;
  }

  // Full mobile version with SafeAreaProvider
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' as any : undefined,
  },
});

export default App;