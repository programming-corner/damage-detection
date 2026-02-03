// Web-compatible camera service
export interface WebImageResult {
  uri: string;
  fileName: string;
  type: string;
  fileSize: number;
}

export const launchImagePicker = (): Promise<WebImageResult | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera'; // This requests camera on mobile browsers
    
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            uri: reader.result as string,
            fileName: file.name,
            type: file.type,
            fileSize: file.size,
          });
        };
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    };
    
    input.click();
  });
};

export const requestCameraPermission = (): Promise<boolean> => {
  // For web, we can't really request camera permission
  // The browser will prompt when the user tries to use camera
  return Promise.resolve(true);
};