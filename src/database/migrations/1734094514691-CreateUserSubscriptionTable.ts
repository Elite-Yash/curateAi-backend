import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserSubscriptionTable1734094514691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the subscriptions table
        await queryRunner.createTable(
            new Table({
                name: 'user_subscriptions',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'stripe_customer_id',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'stripe_subscription_id',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'stripe_plan_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'stripe_plan_duration',
                        type: 'enum',
                        enum: ['month', 'year'],
                        isNullable: false,
                        default: null
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['active', 'inactive','incomplete', 'canceled', 'trialing'],
                        isNullable: false,
                        default: `'active'`,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the subscriptions table
        await queryRunner.dropTable('subscriptions');
    }

}
