import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePlansTable1734096062397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'plans',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'plan_name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'plan_duration',
                        type: 'enum',
                        enum: ['monthly', 'yearly'],
                        isNullable: false,
                    },
                    {
                        name: 'plan_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'stripe_plan_id',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'plan_status',
                        type: 'enum',
                        enum: ['active', 'inactive'],
                        default: `'active'`,
                        isNullable: false,
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
        await queryRunner.dropTable('plans');
    }
}
