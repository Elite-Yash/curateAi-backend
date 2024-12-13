import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('user_subscriptions')
export class UserSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    stripe_customer_id: string;

    @Column()
    stripe_subscription_id: string;

    @Column()
    stripe_plan_id: string;

    @Column({
        name: 'stripe_plan_duration',
        type: 'enum',
        enum: ['monthly', 'yearly'],
    })
    stripe_plan_duration: 'monthly' | 'yearly';

    @Column({
        name: 'status',
        type: 'enum',
        enum: ['active', 'inactive', 'canceled', 'trialing'],
        default: 'active',
    })
    status: 'active' | 'inactive' | 'canceled' | 'trialing';

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
