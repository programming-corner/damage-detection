export interface ExifData {
  DateTime?: string;
  [key: string]: unknown;
}

export interface GpsData {
  latitude?: number;
  longitude?: number;
}

export interface ImageMetadata {
  exif?: ExifData;
  gps?: {
    latitude?: number;
    longitude?: number;
  };
  timestamp?: Date;
}
