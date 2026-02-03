import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Text,
  Searchbar,
  FAB,
} from 'react-native-paper';
import {damageReportAPI} from '../../services/api';
import {spacing} from '../../theme/theme';

interface Report {
  id: string;
  item_sku: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'MANUAL';
  created_at: string;
  final_confidence?: number;
}

const ReportsListScreen: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchQuery]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await damageReportAPI.getReports();
      setReports(response);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadReports();
    setIsRefreshing(false);
  };

  const filterReports = () => {
    if (!searchQuery.trim()) {
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter(report =>
      report.item_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReports(filtered);
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
    <View style={styles.container}>
      <Searchbar
        placeholder="Search reports..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        
        {filteredReports.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>No Reports Found</Title>
              <Paragraph>
                {reports.length === 0
                  ? 'No damage reports yet. Create your first report!'
                  : 'No reports match your search criteria.'}
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredReports.map(report => (
            <Card key={report.id} style={styles.reportCard}>
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
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="add"
        onPress={() => {}}
        label="New Report"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: spacing.md,
    elevation: 2,
  },
  emptyCard: {
    margin: spacing.md,
    elevation: 2,
  },
  reportCard: {
    margin: spacing.md,
    marginTop: 0,
    marginBottom: spacing.sm,
    elevation: 2,
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
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
  },
});

export default ReportsListScreen;