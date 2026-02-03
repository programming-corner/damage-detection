import {DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
    disabled: '#00000061',
    placeholder: '#00000061',
    backdrop: '#00000099',
    error: '#B00020',
    success: '#4caf50',
    warning: '#ff9800',
  },
  fonts: {
    ...DefaultTheme.fonts,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export type Theme = typeof theme;