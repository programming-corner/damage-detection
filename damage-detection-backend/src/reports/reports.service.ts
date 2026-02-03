import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DamageReport, ReportStatus } from '../entities/damage-report.entity';
import { DamageImage } from '../entities/damage-image.entity';
import { UploadService, ImageMetadata } from './upload.service';

export interface CreateReportDto {
  item_sku: string;
  created_by_id: string;
  created_by_email: string;
  created_by_name?: string;
}

export interface UploadedFile {
  filename: string;
  originalname: string;
  size: number;
  mimetype: string;
  path: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(DamageReport)
    private reportsRepository: Repository<DamageReport>,
    @InjectRepository(DamageImage)
    private imagesRepository: Repository<DamageImage>,
    private uploadService: UploadService,
  ) {}

  async createReport(reportData: CreateReportDto): Promise<DamageReport> {
    const report = this.reportsRepository.create({
      ...reportData,
      status: ReportStatus.PENDING,
    });
    
    return this.reportsRepository.save(report);
  }

  async addImageToReport(
    reportId: number,
    file: UploadedFile,
  ): Promise<DamageImage> {
    // Extract metadata from the uploaded image
    const metadata: ImageMetadata = await this.uploadService.extractImageMetadata(
      file.path,
    );

    // Create image record
    const image = this.imagesRepository.create({
      report_id: reportId,
      image_url: this.uploadService.getFileUrl(file.filename),
      filename: file.filename,
      original_name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      metadata,
    });

    return this.imagesRepository.save(image);
  }

  async getReport(id: number): Promise<DamageReport | null> {
    return this.reportsRepository.findOne({
      where: { id },
      relations: ['images', 'analysis_results'],
    });
  }

  async getReports(status?: ReportStatus): Promise<DamageReport[]> {
    const where = status ? { status } : {};
    return this.reportsRepository.find({
      where,
      relations: ['images'],
      order: { created_at: 'DESC' },
    });
  }
}