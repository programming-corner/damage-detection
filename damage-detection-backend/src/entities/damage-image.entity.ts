import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DamageReport } from './damage-report.entity';

@Entity('damage_images')
export class DamageImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  report_id: number;

  @ManyToOne(() => DamageReport, (report) => report.images)
  @JoinColumn({ name: 'report_id' })
  report: DamageReport;

  @Column()
  image_url: string;

  @Column({ type: 'text' })
  filename: string;

  @Column({ type: 'text' })
  original_name: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'text' })
  mimetype: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    exif?: any;
    gps?: {
      latitude?: number;
      longitude?: number;
    };
    timestamp?: Date;
  };

  @CreateDateColumn()
  created_at: Date;
}
