import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Divider,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {logout} from '../../store/slices/authSlice';
import {spacing} from '../../theme/theme';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <Title>Profile Information</Title>
          <Paragraph>Email: {user?.email}</Paragraph>
          <Paragraph>Role: {user?.role}</Paragraph>
          {user?.location_id && (
            <Paragraph>Location ID: {user.location_id}</Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <Card.Content>
          <Title>Settings</Title>
        </Card.Content>
        
        <List.Item
          title="Notifications"
          description="Manage notification preferences"
          left={props => <List.Icon {...props} icon="notifications" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        
        <Divider />
        
        <List.Item
          title="Privacy"
          description="Privacy and data settings"
          left={props => <List.Icon {...props} icon="privacy-tip" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        
        <Divider />
        
        <List.Item
          title="Help & Support"
          description="Get help and contact support"
          left={props => <List.Icon {...props} icon="help" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
        
        <Divider />
        
        <List.Item
          title="About"
          description="App version and information"
          left={props => <List.Icon {...props} icon="info" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
        />
      </Card>

      <Card style={styles.logoutCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleLogout}
            icon="logout"
            buttonColor="#f44336">
            Sign Out
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: spacing.md,
    elevation: 2,
  },
  menuCard: {
    margin: spacing.md,
    marginTop: 0,
    elevation: 2,
  },
  logoutCard: {
    margin: spacing.md,
    marginTop: 0,
    elevation: 2,
  },
});

export default ProfileScreen;