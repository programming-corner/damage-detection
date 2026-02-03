import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
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
import {launchCamera, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  setCameraPermission,
  setLocationPermission,
  setLoading,
  setError,
  setSuccess,
} from '../../store/slices/uiSlice';
import {damageReportAPI} from '../../services/api';
import {spacing} from '../../theme/theme';

const {width} = Dimensions.get('window');

const CameraScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentReport, isSubmitting} = useSelector(
    (state: RootState) => state.damageReport,
  );
  const {cameraPermissionGranted, locationPermissionGranted} = useSelector(
    (state: RootState) => state.ui,
  );

  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    requestPermissions();
    getCurrentLocation();
  }, []);

  const requestPermissions = async () => {
    try {
      // Camera permission
      const cameraResult = await request(
        Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
      );
      dispatch(setCameraPermission(cameraResult === RESULTS.GRANTED));

      // Location permission
      const locationResult = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      dispatch(setLocationPermission(locationResult === RESULTS.GRANTED));
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!locationPermissionGranted) return;

    Geolocation.getCurrentPosition(
      position => {
        dispatch(
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        );
      },
      error => {
        console.error('Location error:', error);
        dispatch(setError('Failed to get current location'));
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const takePhoto = () => {
    if (!cameraPermissionGranted) {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to capture images.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Settings', onPress: requestPermissions},
        ],
      );
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      includeBase64: false,
      maxWidth: 1920,
      maxHeight: 1080,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorCode) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const imageData = {
          uri: asset.uri!,
          fileName: asset.fileName || `damage_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          fileSize: asset.fileSize || 0,
          timestamp: new Date().toISOString(),
          location: currentReport.location || undefined,
        };

        dispatch(addImage(imageData));
        
        // Get location for this specific image if available
        if (locationPermissionGranted && !currentReport.location) {
          getCurrentLocation();
        }
      }
    });
  };

  const removePhoto = (index: number) => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Remove', style: 'destructive', onPress: () => dispatch(removeImage(index))},
      ],
    );
  };

  const submitReport = async () => {
    if (!currentReport.itemSku.trim()) {
      Alert.alert('Error', 'Please enter an item SKU');
      return;
    }

    if (currentReport.images.length === 0) {
      Alert.alert('Error', 'Please capture at least one image');
      return;
    }

    if (!currentReport.location) {
      Alert.alert('Error', 'Location information is required');
      return;
    }

    dispatch(setLoading(true));
    setUploadProgress(0);

    try {
      // Create the damage report
      const reportResponse = await damageReportAPI.createReport({
        itemSku: currentReport.itemSku,
        notes: currentReport.notes,
        location: currentReport.location,
      });

      const reportId = reportResponse.id;

      // Upload images one by one
      for (let i = 0; i < currentReport.images.length; i++) {
        const image = currentReport.images[i];
        await damageReportAPI.uploadImage(image.uri, reportId);
        setUploadProgress((i + 1) / currentReport.images.length);
      }

      dispatch(setSuccess('Damage report submitted successfully'));
      dispatch(clearCurrentReport());
      setUploadProgress(0);

      Alert.alert(
        'Success',
        'Your damage report has been submitted and is being processed.',
        [{text: 'OK'}],
      );
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to submit damage report'));
      Alert.alert('Error', 'Failed to submit damage report. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const canSubmit =
    currentReport.itemSku.trim() &&
    currentReport.images.length > 0 &&
    currentReport.location &&
    !isSubmitting;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Report Damage</Title>

          <TextInput
            label="Item SKU *"
            value={currentReport.itemSku}
            onChangeText={text => dispatch(setItemSku(text))}
            mode="outlined"
            style={styles.input}
            autoCapitalize="characters"
          />

          <TextInput
            label="Notes (Optional)"
            value={currentReport.notes}
            onChangeText={text => dispatch(setNotes(text))}
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
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{uri: image.uri}} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePhoto(index)}>
                      <Icon name="close" size={20} color="white" />
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
              Capture Image
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

      <FAB
        style={styles.fab}
        icon="photo-camera"
        onPress={takePhoto}
        disabled={!cameraPermissionGranted}
      />
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
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
  },
});

export default CameraScreen;