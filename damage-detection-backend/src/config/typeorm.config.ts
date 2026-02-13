import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DamageReport } from '../entities/damage-report.entity';
import { DamageImage } from '../entities/damage-image.entity';
import { AnalysisResult } from '../entities/analysis-result.entity';

// Load environment variables for CLI usage
dotenv.config();

// TypeORM configuration factory for NestJS
export const createTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') || 'localhost',
  port: Number.parseInt(configService.get('DATABASE_PORT') || '5432', 10),
  username: configService.get('DATABASE_USER') || 'user',
  password: configService.get('DATABASE_PASSWORD') || 'password',
  database: configService.get('DATABASE_NAME') || 'analysis_system',
  entities: [DamageReport, DamageImage, AnalysisResult],
  // Don't auto-load migrations in the app (only for CLI)
  migrations: [],
  migrationsRun: false,
  synchronize: false, // Never use synchronize with migrations
  logging: configService.get('NODE_ENV') === 'development',
  ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});

// Static configuration for TypeORM CLI (uses environment variables directly)
export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number.parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'analysis_system',
  entities: [DamageReport, DamageImage, AnalysisResult],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// DataSource for TypeORM CLI
const dataSource = new DataSource(typeOrmConfig);

export default dataSource;