import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { DamageReport } from './src/entities/damage-report.entity';
import { DamageImage } from './src/entities/damage-image.entity';
import { AnalysisResult } from './src/entities/analysis-result.entity';

// Load environment variables
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number.parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || process.env.POSTGRES_USER || 'damage_user',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'damage_pass',
  database: process.env.DB_DATABASE || process.env.POSTGRES_DB || 'damage_detection_db',
  entities: [DamageReport, DamageImage, AnalysisResult],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: process.env.NODE_ENV === 'development' && process.env.DB_SYNC === 'true',
  logging: process.env.NODE_ENV === 'development' || process.env.DB_LOGGING === 'true',
});

export default dataSource;