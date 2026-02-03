import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Text,
  Surface,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {damageReportAPI} from '../../services/api';
import {spacing} from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  confirmedReports: number;
  rejectedReports: number;
}

const DashboardScreen: React.FC = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const {currentReport} = useSelector((state: RootState) => state.damageReport);

  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingReports: 0,
    confirmedReports: 0,
    rejectedReports: 0,
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load recent reports
      const reportsResponse = await damageReportAPI.getReports();
      setRecentReports(reportsResponse.slice(0, 5)); // Show last 5 reports

      // Calculate stats
      const newStats = {
        totalReports: reportsResponse.length,
        pendingReports: reportsResponse.filter((r: any) => r.status === 'PENDING').length,
        confirmedReports: reportsResponse.filter((r: any) => r.status === 'CONFIRMED').length,
        rejectedReports: reportsResponse.filter((r: any) => r.status === 'REJECTED').length,
      };
      setStats(newStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#ff9800';
      case 'CONFIRMED':
        return '#4caf50';
      case 'REJECTED':
        return '#f44336';
      case 'MANUAL':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
      
      {/* Welcome Section */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title>Welcome back, {user?.email}</Title>
          <Paragraph>
            {currentReport.itemSku 
              ? `You have a report in progress for item ${currentReport.itemSku}`
              : 'Ready to report damage? Use the camera to get started.'
            }
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Statistics Cards */}
      <View style={styles.statsGrid}>
        <Surface style={[styles.statCard, {backgroundColor: '#e3f2fd'}]}>
          <Icon name="assignment" size={24} color="#1976d2" />
          <Text style={styles.statNumber}>{stats.totalReports}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </Surface>

        <Surface style={[styles.statCard, {backgroundColor: '#fff3e0'}]}>
          <Icon name="schedule" size={24} color="#f57c00" />
          <Text style={styles.statNumber}>{stats.pendingReports}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Surface>

        <Surface style={[styles.statCard, {backgroundColor: '#e8f5e8'}]}>
          <Icon name="check-circle" size={24} color="#388e3c" />
          <Text style={styles.statNumber}>{stats.confirmedReports}</Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </Surface>

        <Surface style={[styles.statCard, {backgroundColor: '#ffebee'}]}>
          <Icon name="cancel" size={24} color="#d32f2f" />
          <Text style={styles.statNumber}>{stats.rejectedReports}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </Surface>
      </View>

      {/* Recent Reports */}
      <Card style={styles.recentCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Recent Reports</Title>
            <Button mode="text" compact onPress={() => {}}>
              View All
            </Button>
          </View>

          {recentReports.length === 0 ? (
            <Paragraph style={styles.emptyText}>
              No reports yet. Start by capturing your first damage report!
            </Paragraph>
          ) : (
            recentReports.map((report, index) => (
              <Card key={report.id || index} style={styles.reportItem}>
                <Card.Content>
                  <View style={styles.reportHeader}>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportSku}>{report.item_sku}</Text>
                      <Text style={styles.reportDate}>
                        {formatDate(report.created_at)}
                      </Text>
                    </View>
                    <Chip
                      mode="flat"
                      textStyle={{color: getStatusColor(report.status)}}
                      style={{
                        backgroundColor: getStatusColor(report.status) + '20',
                      }}>
                      {report.status}
                    </Chip>
                  </View>
                  
                  {report.final_confidence && (
                    <Text style={styles.confidence}>
                      Confidence: {Math.round(report.final_confidence * 100)}%
                    </Text>
                  )}
                </Card.Content>
              </Card>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              icon="photo-camera"
              onPress={() => {}}
              style={styles.actionButton}>
              New Report
            </Button>
            <Button
              mode="outlined"
              icon="assignment"
              onPress={() => {}}
              style={styles.actionButton}>
              View Reports
            </Button>
          </View>
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
  welcomeCard: {
    margin: spacing.md,
    marginBottom: spacing.sm,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: spacing.xs,
  },
  recentCard: {
    margin: spacing.md,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
  reportItem: {
    marginBottom: spacing.sm,
    elevation: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
  },
  reportSku: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reportDate: {
    opacity: 0.6,
    fontSize: 12,
  },
  confidence: {
    marginTop: spacing.xs,
    fontSize: 12,
    opacity: 0.8,
  },
  actionsCard: {
    margin: spacing.md,
    marginTop: 0,
    elevation: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});

export default DashboardScreen;