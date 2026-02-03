import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DamageImage } from './damage-image.entity';
import { AnalysisResult } from './analysis-result.entity';

export enum ReportStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  MANUAL = 'MANUAL',
}

@Entity('damage_reports')
export class DamageReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item_sku: string;

  @Column()
  created_by_id: string; // User ID from cloud service

  @Column()
  created_by_email: string; // User email from cloud service

  @Column({ nullable: true })
  created_by_name: string; // User name from cloud service

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  final_confidence: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => DamageImage, (image) => image.report)
  images: DamageImage[];

  @OneToMany(() => AnalysisResult, (result) => result.report)
  analysis_results: AnalysisResult[];
}