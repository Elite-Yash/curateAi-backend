import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('automation_processes')
export class AutomationProcess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'int', nullable: false })
  campaign_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'enum', enum: ['incomplete', 'in progress', 'completed'], nullable: true })
  status: 'incomplete' | 'in progress' | 'completed';

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at?: Date;
}
