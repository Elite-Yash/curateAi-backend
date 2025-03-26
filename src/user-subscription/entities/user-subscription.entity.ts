import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('user_subscriptions')
export class UserSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;
    
    @Column()
    stripe_customer_id: string;

    @Column()
    stripe_subscription_id: string;

    @Column()
    stripe_plan_id: string;

    @Column({
        name: 'stripe_plan_duration',
        type: 'enum',
        enum: ['month', 'year'],
    })
    stripe_plan_duration: 'month' | 'year';

    @Column({
        name: 'status',
        type: 'enum',
        enum: ['active', 'inactive','incomplete', 'canceled', 'trialing'],
        default: 'active',
    })
    status: 'active' | 'inactive' | 'incomplete' | 'canceled' | 'trialing';

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
