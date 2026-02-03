import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';
import * as exifr from 'exifr';

const ensureDir = promisify(fs.mkdir);

export interface ImageMetadata {
  exif?: any;
  gps?: {
    latitude?: number;
    longitude?: number;
  };
  timestamp?: Date;
}

@Injectable()
export class UploadService {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || './uploads';
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await ensureDir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  async extractImageMetadata(filePath: string): Promise<ImageMetadata> {
    try {
      const exifData = await exifr.parse(filePath);
      const gps = await exifr.gps(filePath);
      
      return {
        exif: exifData,
        gps: gps ? { latitude: gps.latitude, longitude: gps.longitude } : undefined,
        timestamp: exifData?.DateTime ? new Date(exifData.DateTime) : undefined,
      };
    } catch (error) {
      console.warn('Failed to extract EXIF data:', error);
      return {};
    }
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  getFileUrl(filename: string): string {
    // This will be the URL to access the file
    return `/uploads/${filename}`;
  }
}