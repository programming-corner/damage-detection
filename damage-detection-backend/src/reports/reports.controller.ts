import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService, CreateReportDto } from './reports.service';
import { ReportStatus } from '../entities/damage-report.entity';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('damage')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async reportDamage(
    @Body() createReportDto: { item_sku: string },
    @UploadedFiles() files: Express.Multer.File[],
    @Request() { user }: { user: { id: string; email: string; name: string } },
  ) {
    const reportData: CreateReportDto = {
      item_sku: createReportDto.item_sku,
      created_by_id: user.id,
      created_by_email: user.email,
      created_by_name: user.name,
    };

    // Create the damage report
    const report = await this.reportsService.createReport(reportData);

    // Add images to the report
    const images: any[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const image = await this.reportsService.addImageToReport(report.id, {
          filename: file.filename,
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          path: file.path,
        });
        images.push(image);
      }
    }

    return {
      message: 'Damage report created successfully',
      report: {
        ...report,
        images,
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getReport(@Param('id', ParseIntPipe) id: number) {
    const report = await this.reportsService.getReport(id);
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getReports(@Query('status') status?: ReportStatus) {
    return this.reportsService.getReports(status);
  }
}
