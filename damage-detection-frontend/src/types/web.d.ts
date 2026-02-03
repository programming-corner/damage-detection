// Type declarations for web environment
declare global {
  interface Navigator {
    geolocation: Geolocation;
  }

  interface HTMLInputElement {
    files: FileList | null;
    capture?: string;
  }
}

export {};