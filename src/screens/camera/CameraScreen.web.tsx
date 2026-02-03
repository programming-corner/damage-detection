import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Button,
  TextInput,
  Text,
  Card,
  Title,
  FAB,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {AppDispatch, RootState} from '../../store/store';
import {
  setItemSku,
  addImage,
  removeImage,
  setNotes,
  setLocation,
  clearCurrentReport,
} from '../../store/slices/damageReportSlice';
import {
  setLoading,
  setError,
  setSuccess,
} from '../../store/slices/uiSlice';
import {damageReportAPI} from '../../services/api';
import {spacing} from '../../theme/theme';

// Web-compatible imports
import {launchImagePicker} from '../../services/camera.web';
import {getCurrentPosition, requestLocationPermission} from '../../services/location.web';

const CameraScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentReport, isSubmitting} = useSelector(
    (state: RootState) => state.damageReport,
  );

  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    requestPermissions();
    getCurrentLocationWeb();
  }, []);

  const requestPermissions = async () => {
    try {
      // For web, we just check if geolocation is available
      const locationGranted = await requestLocationPermission();
      console.log('Location permission:', locationGranted);
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const getCurrentLocationWeb = async () => {
    try {
      const position = await getCurrentPosition();
      dispatch(setLocation(position));
    } catch (error) {
      console.error('Location error:', error);
      dispatch(setError('Failed to get current location. You can still submit reports without location.'));
    }
  };

  const takePhoto = async () => {
    try {
      const result = await launchImagePicker();
      
      if (result) {
        const imageData = {
          uri: result.uri,
          fileName: result.fileName,
          type: result.type,
          fileSize: result.fileSize,
          timestamp: new Date().toISOString(),
          location: currentReport.location || undefined,
        };

        dispatch(addImage(imageData));
        
        // Try to get location if not already available
        if (!currentReport.location) {
          getCurrentLocationWeb();
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      dispatch(setError('Failed to capture image. Please try again.'));
    }
  };

  const removePhoto = (index: number) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to remove this image?')) {
        dispatch(removeImage(index));
      }
    } else {
      Alert.alert(
        'Remove Image',
        'Are you sure you want to remove this image?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Remove', style: 'destructive', onPress: () => dispatch(removeImage(index))},
        ],
      );
    }
  };

  const submitReport = async () => {
    if (!currentReport.itemSku.trim()) {
      const message = 'Please enter an item SKU';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Error', message);
      }
      return;
    }

    if (currentReport.images.length === 0) {
      const message = 'Please capture at least one image';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Error', message);
      }
      return;
    }

    // For web demo, we'll mock the location if not available
    const reportLocation = currentReport.location || {
      latitude: 37.7749, // Default to San Francisco coordinates for demo
      longitude: -122.4194,
    };

    dispatch(setLoading(true));
    setUploadProgress(0);

    try {
      // Create the damage report (mock API for web demo)
      const reportData = {
        itemSku: currentReport.itemSku,
        notes: currentReport.notes,
        location: reportLocation,
      };

      console.log('Creating damage report:', reportData);
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i / 100);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      dispatch(setSuccess('Damage report submitted successfully'));
      dispatch(clearCurrentReport());
      setUploadProgress(0);

      const message = 'Your damage report has been submitted and is being processed.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Success', message, [{text: 'OK'}]);
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to submit damage report'));
      const message = 'Failed to submit damage report. Please try again.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const canSubmit =
    currentReport.itemSku.trim() &&
    currentReport.images.length > 0 &&
    !isSubmitting;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Report Damage</Title>

          <TextInput
            label="Item SKU *"
            value={currentReport.itemSku}
            onChangeText={(text) => dispatch(setItemSku(text))}
            mode="outlined"
            style={styles.input}
            autoCapitalize="characters"
          />

          <TextInput
            label="Notes (Optional)"
            value={currentReport.notes}
            onChangeText={(text) => dispatch(setNotes(text))}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <View style={styles.statusContainer}>
            <Chip
              icon={currentReport.location ? 'location-on' : 'location-off'}
              mode={currentReport.location ? 'flat' : 'outlined'}
              style={styles.statusChip}>
              {currentReport.location ? 'Location Captured' : 'No Location'}
            </Chip>

            <Chip
              icon="photo-camera"
              mode={currentReport.images.length > 0 ? 'flat' : 'outlined'}
              style={styles.statusChip}>
              {currentReport.images.length} Photos
            </Chip>
          </View>

          {currentReport.images.length > 0 && (
            <View style={styles.imagesContainer}>
              <Text style={styles.sectionTitle}>Captured Images:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {currentReport.images.map((image, index) => (
                  <View key={`image-${index}`} style={styles.imageContainer}>
                    <Image source={{uri: image.uri}} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePhoto(index)}>
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {uploadProgress > 0 && uploadProgress < 1 && (
            <View style={styles.progressContainer}>
              <Text>Uploading images... {Math.round(uploadProgress * 100)}%</Text>
              <ProgressBar progress={uploadProgress} style={styles.progressBar} />
            </View>
          )}

          <View style={styles.buttonsContainer}>
            <Button
              mode="outlined"
              onPress={takePhoto}
              icon="photo-camera"
              style={styles.button}>
              {Platform.OS === 'web' ? 'Select Image' : 'Capture Image'}
            </Button>

            <Button
              mode="contained"
              onPress={submitReport}
              disabled={!canSubmit}
              loading={isSubmitting}
              style={styles.button}>
              Submit Report
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
  card: {
    margin: spacing.md,
    elevation: 4,
  },
  input: {
    marginBottom: spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statusChip: {
    marginRight: spacing.sm,
  },
  imagesContainer: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    marginTop: spacing.sm,
  },
  buttonsContainer: {
    gap: spacing.sm,
  },
  button: {
    marginBottom: spacing.sm,
  },
});

export default CameraScreen;