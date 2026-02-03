import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function SimpleWebApp() {
  const [count, setCount] = React.useState(0);
  const [reports, setReports] = React.useState([
    { id: 1, title: 'Crack in Wall', location: 'Building A', severity: 'Medium' },
    { id: 2, title: 'Roof Damage', location: 'Building B', severity: 'High' },
    { id: 3, title: 'Window Crack', location: 'Building C', severity: 'Low' },
  ]);

  const addNewReport = () => {
    const newReport = {
      id: reports.length + 1,
      title: `Damage Report ${reports.length + 1}`,
      location: `Building ${String.fromCharCode(65 + reports.length)}`,
      severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    };
    setReports([...reports, newReport]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#ff4444';
      case 'Medium': return '#ff8800';
      case 'Low': return '#44aa44';
      default: return '#666666';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏗️ Damage Detection App</Text>
        <Text style={styles.subtitle}>Web Version - Ready for Development</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{reports.length}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{reports.filter(r => r.severity === 'High').length}</Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{count}</Text>
          <Text style={styles.statLabel}>App Launches</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addNewReport}>
        <Text style={styles.addButtonText}>➕ Add New Report</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.countButton} onPress={() => setCount(count + 1)}>
        <Text style={styles.countButtonText}>🚀 Launch Count: {count}</Text>
      </TouchableOpacity>

      <View style={styles.reportsSection}>
        <Text style={styles.sectionTitle}>📋 Recent Damage Reports</Text>
        {reports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) }]}>
                <Text style={styles.severityText}>{report.severity}</Text>
              </View>
            </View>
            <Text style={styles.reportLocation}>📍 {report.location}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✅ React Native Web is working!{'\n'}
          ✅ Platform-specific setup complete{'\n'}
          ✅ Ready for camera and geolocation integration
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  stats: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  countButton: {
    backgroundColor: '#FF9800',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  countButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reportLocation: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    lineHeight: 20,
  },
});