import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DamageReport } from '../entities/damage-report.entity';
import { DamageImage } from '../entities/damage-image.entity';
import { AnalysisResult } from '../entities/analysis-result.entity';

// Load environment variables for CLI usage
dotenv.config();

// TypeORM configuration factory for NestJS
export const createTypeOrmConfig = (configService: ConfigService): DataSourceOptions => {
  // Explicitly unset DATABASE_URL to prevent TypeORM from using it
  delete process.env.DATABASE_URL;
  
  console.log('DATABASE_URL after deletion (should be undefined):', process.env.DATABASE_URL);
  const config = {
    type: 'postgres' as const,
    host: configService.get('DB_HOST') || 'localhost',
    port: Number.parseInt(configService.get('DB_PORT') || '5432', 10),
    username: configService.get('DB_USERNAME') || 'user',
    password: configService.get('DB_PASSWORD') || 'password',
    database: configService.get('DB_DATABASE') || 'analysis_system',
    entities: [DamageReport, DamageImage, AnalysisResult],
    // Don't auto-load migrations in the app (only for CLI)
    migrations: [],
    migrationsRun: false,
    synchronize: configService.get('DB_SYNC') === 'true',
    logging: configService.get('DB_LOGGING') === 'true' || configService.get('NODE_ENV') === 'development',
    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  };

  // Debug logging
  console.log('=== TypeORM Configuration Debug ===');
  console.log('Environment Variables:');
  console.log('DB_HOST:', configService.get('DB_HOST'));
  console.log('DB_PORT:', configService.get('DB_PORT'));
  console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
  console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
  console.log('DATABASE_URL (should be undefined):', configService.get('DATABASE_URL'));
  console.log('Final config:', config);
  console.log('================================');

  return config;
};

// Static configuration for TypeORM CLI (uses environment variables directly)
export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number.parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'analysis_system',
  entities: [DamageReport, DamageImage, AnalysisResult],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// DataSource for TypeORM CLI
const dataSource = new DataSource(typeOrmConfig);

export default dataSource;