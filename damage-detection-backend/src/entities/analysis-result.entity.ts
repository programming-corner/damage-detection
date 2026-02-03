import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DamageReport } from './damage-report.entity';

@Entity('analysis_results')
export class AnalysisResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  report_id: number;

  @ManyToOne(() => DamageReport, (report) => report.analysis_results)
  @JoinColumn({ name: 'report_id' })
  report: DamageReport;

  @Column()
  result: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  confidence: number;

  @Column({ type: 'jsonb', nullable: true })
  raw_response: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}