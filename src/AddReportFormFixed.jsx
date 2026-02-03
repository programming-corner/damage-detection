import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';

export default function AddReportForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'Medium',
    category: 'Product Damage',
    image: null,
  });

  const categories = [
    'Product Damage',
    'Batch/Inventory', 
    'Kitchen Equipment',
    'Refrigeration',
    'HVAC System',
    'Roof/Building',
    'Electrical',
    'Plumbing',
    'Safety Equipment',
    'Other'
  ];
  const severities = ['Low', 'Medium', 'High', 'Critical'];

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            image: {
              uri: e.target.result,
              name: file.name,
              type: file.type,
              size: file.size,
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const handleCameraCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      })
      .then(stream => {
        // Create camera modal
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        `;

        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.style.cssText = `
          width: 80vmin;
          height: 60vmin;
          border: 2px solid white;
          border-radius: 8px;
        `;

        const controls = document.createElement('div');
        controls.style.cssText = `
          display: flex;
          gap: 20px;
          margin-top: 20px;
        `;

        const captureBtn = document.createElement('button');
        captureBtn.textContent = '📷 Capture';
        captureBtn.style.cssText = `
          padding: 12px 24px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '❌ Cancel';
        cancelBtn.style.cssText = `
          padding: 12px 24px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        `;

        captureBtn.onclick = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0);
          
          canvas.toBlob(blob => {
            const imageUrl = URL.createObjectURL(blob);
            setFormData(prev => ({
              ...prev,
              image: {
                uri: imageUrl,
                name: `camera_${Date.now()}.jpg`,
                type: 'image/jpeg',
                size: blob.size,
              }
            }));
          }, 'image/jpeg', 0.8);
          
          stream.getTracks().forEach(track => track.stop());
          modal.remove();
        };

        cancelBtn.onclick = () => {
          stream.getTracks().forEach(track => track.stop());
          modal.remove();
        };

        controls.appendChild(captureBtn);
        controls.appendChild(cancelBtn);
        modal.appendChild(video);
        modal.appendChild(controls);
        document.body.appendChild(modal);
      })
      .catch(() => {
        alert('Camera not available. Using file upload instead.');
        handleImageUpload();
      });
    } else {
      alert('Camera not supported. Using file upload instead.');
      handleImageUpload();
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter a report title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!formData.location.trim()) {
      alert('Please enter a location');
      return;
    }

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
        <Text style={styles.headerTitle}>📋 New Incident Report</Text>
        <Text style={styles.headerSubtitle}>Report product, equipment, or facility damage</Text>
      </View>

      {/* Image Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📷 Photo Evidence</Text>
        
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
            <Text style={styles.imageButtonText}>📁 Upload Image</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.imageButton} onPress={handleCameraCapture}>
            <Text style={styles.imageButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>
        </View>

        {formData.image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: formData.image.uri }} style={styles.imagePreview} />
            <Text style={styles.imageInfo}>✅ Image Selected: {formData.image.name}</Text>
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setFormData(prev => ({ ...prev, image: null }))}
            >
              <Text style={styles.removeImageText}>🗑️ Remove Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderIcon}>📷</Text>
            <Text style={styles.imagePlaceholderText}>No image selected</Text>
          </View>
        )}
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
            placeholder="e.g., Damaged coffee machine, Spoiled batch #A123, Roof leak"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="Describe the damage: equipment malfunction, product contamination, facility issue, etc."
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
            placeholder="e.g., Kitchen Area, Aisle 3, Cold Storage, Batch #A123, Equipment ID"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Category Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>� Damage Category</Text>
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
  imageButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imagePlaceholder: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#666',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageInfo: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  removeImageButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
  },
  removeImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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