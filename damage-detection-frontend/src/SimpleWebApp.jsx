import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AddReportForm from './AddReportFormFixed.jsx';

export default function SimpleWebApp() {
  const [count, setCount] = React.useState(0);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [reports, setReports] = React.useState([
    { id: 1, title: 'Coffee Machine Malfunction', location: 'Kitchen Area', severity: 'High', category: 'Kitchen Equipment', status: 'Open' },
    { id: 2, title: 'Refrigerator Temperature Alert', location: 'Cold Storage A', severity: 'Critical', category: 'Refrigeration', status: 'In Progress' },
    { id: 3, title: 'Damaged Product Batch #A123', location: 'Aisle 3, Shelf B', severity: 'Medium', category: 'Product Damage', status: 'Open' },
    { id: 4, title: 'Roof Leak in Storage', location: 'Back Storage Room', severity: 'High', category: 'Roof/Building', status: 'Open' },
  ]);

  const handleAddReport = (newReport) => {
    setReports(prevReports => [newReport, ...prevReports]);
    setShowAddForm(false);
    // Show success message or notification here
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddReportForm 
        onSubmit={handleAddReport}
        onCancel={handleCancelAdd}
      />
    );
  }

  const getSeverityColor = (severity) => {
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
        <Text style={styles.title}>� Store Management System</Text>
        <Text style={styles.subtitle}>Incident Reporting & Facilities Management</Text>
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

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
        <Text style={styles.addButtonText}>➕ Add New Report</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.countButton} onPress={() => setCount(count + 1)}>
        <Text style={styles.countButtonText}>🚀 Launch Count: {count}</Text>
      </TouchableOpacity>

      <View style={styles.reportsSection}>
        <Text style={styles.sectionTitle}>📋 Recent Incident Reports</Text>
        {reports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) }]}>
                <Text style={styles.severityText}>{report.severity}</Text>
              </View>
            </View>
            <Text style={styles.reportLocation}>📍 {report.location}</Text>
            <View style={styles.reportMeta}>
              <Text style={styles.reportCategory}>🏗️ {report.category}</Text>
              <Text style={styles.reportStatus}>🔄 {report.status}</Text>
            </View>
            {report.image && (
              <View style={styles.reportImageContainer}>
                <Text style={styles.reportImageIndicator}>📷 Photo attached</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✅ Store management system active!{'\n'}
          ✅ Photo evidence capture ready{'\n'}
          ✅ Inventory & equipment monitoring enabled
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
    marginBottom: 8,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  reportCategory: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  reportStatus: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },
  reportImageContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reportImageIndicator: {
    fontSize: 12,
    color: '#ff9800',
    fontStyle: 'italic',
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