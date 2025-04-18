import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('crm')
export class Crm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column({ length: 255 })
  crm_name: string;

  @Column({ unique: true, length: 255 })
  token: string;

  @Column({ length: 255, nullable: false })
  crm_url?: string;
}
