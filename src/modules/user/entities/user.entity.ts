import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Campaign } from '../../campaigns/entities/campaign.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255 })
    stripe_customer_id: string;

    @Column({
        type: 'enum',
        enum: ['expired', 'trial', 'active'],
        default: 'trial',
    })
    subscription_status: 'expired' | 'trial' | 'active';

    @Column({ type: 'int', default: 0 })
    ai_token_balance: number;

    @Column({ nullable: true })
    email_verification_token: string;

    @Column({ default: false })
    is_email_verified: boolean;

    @Column({ nullable: true, type: 'timestamp' })
    email_verification_token_expiry: Date;

    @Column({ type: 'varchar', length: 50, default: 'active' })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;


    // 👇 relation with Campaign
    @OneToMany(() => Campaign, (campaign) => campaign.user)
    campaigns: Campaign[];

}
