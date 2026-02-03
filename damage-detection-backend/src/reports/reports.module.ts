import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { UploadService } from './upload.service';
import { DamageReport } from '../entities/damage-report.entity';
import { DamageImage } from '../entities/damage-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DamageReport, DamageImage])],
  controllers: [ReportsController],
  providers: [ReportsService, UploadService],
})
export class ReportsModule {}