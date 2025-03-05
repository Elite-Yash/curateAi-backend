import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255, nullable: true })
    position?: string;

    @Column({ length: 255, nullable: true })
    organization?: string;

    @Column({ type: 'text', nullable: true })
    url?: string;

    @Column({ type: 'text', nullable: true })
    profile?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}
