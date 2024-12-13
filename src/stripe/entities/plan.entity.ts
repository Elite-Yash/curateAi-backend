import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plans')
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    plan_name: string;

    @Column({
        type: 'enum',
        enum: ['monthly', 'yearly'],
        nullable: false
    })
    plan_duration: 'monthly' | 'yearly';

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false
    })
    plan_amount: number;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
    })
    stripe_plan_id: string;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive'],
        default: 'active',
        nullable: false
    })
    plan_status: 'active' | 'inactive';

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
