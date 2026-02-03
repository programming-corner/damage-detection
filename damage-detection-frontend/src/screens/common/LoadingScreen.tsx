import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {spacing} from '../../theme/theme';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size="large" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: spacing.md,
    fontSize: 16,
  },
});

export default LoadingScreen;