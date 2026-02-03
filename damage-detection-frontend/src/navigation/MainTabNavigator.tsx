import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CameraScreen from '../screens/camera/CameraScreen';
import ReportsListScreen from '../screens/reports/ReportsListScreen';
import ReportDetailScreen from '../screens/reports/ReportDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type MainTabParamList = {
  Dashboard: undefined;
  Camera: undefined;
  Reports: undefined;
  Profile: undefined;
};

export type ReportsStackParamList = {
  ReportsList: undefined;
  ReportDetail: {reportId: string};
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const ReportsStack = createStackNavigator<ReportsStackParamList>();

const ReportsNavigator: React.FC = () => {
  return (
    <ReportsStack.Navigator>
      <ReportsStack.Screen
        name="ReportsList"
        component={ReportsListScreen}
        options={{title: 'Damage Reports'}}
      />
      <ReportsStack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{title: 'Report Details'}}
      />
    </ReportsStack.Navigator>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Camera':
              iconName = 'photo-camera';
              break;
            case 'Reports':
              iconName = 'assignment';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: 'Dashboard'}}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{title: 'Capture'}}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsNavigator}
        options={{title: 'Reports'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;