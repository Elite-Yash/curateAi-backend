import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  personas_name: string;

  @Column({ type: 'text', nullable: true })
  personas_bio: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'boolean', default: false })
  isdefault?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
