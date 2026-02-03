import { Platform } from 'react-native';

export const CameraService = {
  // Check if camera is available
  isAvailable: () => {
    if (Platform.OS === 'web') {
      return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    }
    return true; // Assume available on mobile
  },

  // Capture image from camera (web version)
  captureImage: () => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'web') {
        // Create a video element to show camera feed
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Get camera access
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'environment' // Use back camera if available
          } 
        })
        .then(stream => {
          video.srcObject = stream;
          video.play();

          // Create modal overlay for camera
          const modal = createCameraModal(video, () => {
            // Capture photo
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);
            
            // Stop camera stream
            stream.getTracks().forEach(track => track.stop());
            
            // Convert to blob and resolve
            canvas.toBlob(blob => {
              const imageUrl = URL.createObjectURL(blob);
              resolve({
                uri: imageUrl,
                name: `camera_${Date.now()}.jpg`,
                type: 'image/jpeg',
                size: blob.size,
              });
            }, 'image/jpeg', 0.8);
            
            // Remove modal
            document.body.removeChild(modal);
          }, () => {
            // Cancel - stop stream and remove modal
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(modal);
            reject(new Error('Camera capture cancelled'));
          });

          document.body.appendChild(modal);
        })
        .catch(error => {
          reject(new Error('Camera access denied or not available'));
        });
      } else {
        // Mobile implementation would use react-native-image-picker
        reject(new Error('Mobile camera not implemented yet'));
      }
    });
  },

  // Pick image from gallery/file system
  pickImage: () => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                uri: e.target.result,
                name: file.name,
                type: file.type,
                size: file.size,
              });
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          } else {
            reject(new Error('No file selected'));
          }
        };
        input.click();
      } else {
        // Mobile implementation
        reject(new Error('Mobile image picker not implemented yet'));
      }
    });
  },
};

// Helper function to create camera modal for web
function createCameraModal(video, onCapture, onCancel) {
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

  const videoContainer = document.createElement('div');
  videoContainer.style.cssText = `
    position: relative;
    border: 2px solid white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  `;

  video.style.cssText = `
    width: 80vmin;
    height: 60vmin;
    object-fit: cover;
  `;

  const controls = document.createElement('div');
  controls.style.cssText = `
    display: flex;
    gap: 20px;
    margin-top: 20px;
  `;

  const captureBtn = document.createElement('button');
  captureBtn.textContent = '📷 Capture Photo';
  captureBtn.style.cssText = `
    padding: 12px 24px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  `;
  captureBtn.onclick = onCapture;

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '❌ Cancel';
  cancelBtn.style.cssText = `
    padding: 12px 24px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  `;
  cancelBtn.onclick = onCancel;

  controls.appendChild(captureBtn);
  controls.appendChild(cancelBtn);
  videoContainer.appendChild(video);
  modal.appendChild(videoContainer);
  modal.appendChild(controls);

  return modal;
}