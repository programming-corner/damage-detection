import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import { CameraService } from './services/CameraService.js';

export default function AddReportForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'Medium',
    category: 'Structural',
    image: null,
  });

  const categories = ['Structural', 'Electrical', 'Plumbing', 'HVAC', 'Exterior', 'Interior', 'Safety', 'Other'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];

  const handleImagePicker = () => {
    if (typeof window !== 'undefined') {
      // Web environment - show options
      if (window.confirm('Do you want to take a photo with camera? Click OK for camera, Cancel for file upload.')) {
        handleCameraCapture();
      } else {
        handleImageLibrary();
      }
    } else {
      // Mobile environment - use Alert
      Alert.alert(
        'Select Image',
        'Choose how to add an image to your report',
        [
          {
            text: 'Take Photo',
            onPress: handleCameraCapture,
          },
          {
            text: 'Choose from Library',
            onPress: handleImageLibrary,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleCameraCapture = () => {
    CameraService.captureImage()
      .then(image => {
        setFormData(prev => ({ ...prev, image }));
      })
      .catch(error => {
        Alert.alert('Camera Error', error.message);
      });
  };

  const handleImageLibrary = () => {
    CameraService.pickImage()
      .then(image => {
        setFormData(prev => ({ ...prev, image }));
      })
      .catch(error => {
        Alert.alert('Image Picker Error', error.message);
      });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a report title');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Validation Error', 'Please enter a location');
      return;
    }

    // Create report object
    const newReport = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'Open',
    };

    onSubmit(newReport);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 New Damage Report</Text>
        <Text style={styles.headerSubtitle}>Document damage with photos and details</Text>
      </View>

      {/* Image Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📷 Photo Evidence</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
          {formData.image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: formData.image.uri }} style={styles.imagePreview} />
              <Text style={styles.imageInfo}>✅ Image Selected</Text>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderIcon}>📷</Text>
              <Text style={styles.imagePlaceholderText}>Tap to Capture/Upload Image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Report Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Report Title *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="e.g., Crack in exterior wall"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="Detailed description of the damage..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.location}
            onChangeText={(text) => updateField('location', text)}
            placeholder="e.g., Building A, Room 101, North Wall"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Category Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏗️ Damage Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.optionChip,
                formData.category === category && styles.optionChipSelected
              ]}
              onPress={() => updateField('category', category)}
            >
              <Text style={[
                styles.optionChipText,
                formData.category === category && styles.optionChipTextSelected
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Severity Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ Severity Level</Text>
        <View style={styles.severityContainer}>
          {severities.map((severity) => (
            <TouchableOpacity
              key={severity}
              style={[
                styles.severityOption,
                formData.severity === severity && styles.severityOptionSelected,
                { backgroundColor: getSeverityColor(severity, formData.severity === severity) }
              ]}
              onPress={() => updateField('severity', severity)}
            >
              <Text style={[
                styles.severityOptionText,
                formData.severity === severity && styles.severityOptionTextSelected
              ]}>
                {severity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>❌ Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>✅ Submit Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const getSeverityColor = (severity, isSelected) => {
  const colors = {
    'Low': isSelected ? '#2e7d32' : '#e8f5e8',
    'Medium': isSelected ? '#f57c00' : '#fff3e0',
    'High': isSelected ? '#d32f2f' : '#ffebee',
    'Critical': isSelected ? '#c62828' : '#ffebee'
  };
  return colors[severity] || colors['Medium'];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  imagePlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    padding: 12,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  imageInfo: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionContainer: {
    flexDirection: 'row',
  },
  optionChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionChipSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  optionChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: 'white',
  },
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  severityOption: {
    flex: 1,
    minWidth: '22%',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  severityOptionSelected: {
    borderColor: '#333',
  },
  severityOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  severityOptionTextSelected: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  spacing: {
    height: 20,
  },
});