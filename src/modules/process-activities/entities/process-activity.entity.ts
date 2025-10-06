import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'process_activities' })
export class ProcessActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  automation_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  profile_id: string;

  @Column({ 
    type: 'enum', 
    enum: ['incomplete', 'in progress', 'completed'], 
    default: 'incomplete' 
  })
  status: 'incomplete' | 'in progress' | 'completed';

  @Column({ type: 'varchar', length: 255, nullable: true })
  message?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
