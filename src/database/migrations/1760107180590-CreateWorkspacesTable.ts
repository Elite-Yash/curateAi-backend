import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateWorkspacesTable1760107180590 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create workspaces table
        await queryRunner.createTable(
            new Table({
                name: 'workspaces',
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
                        name: 'name',
                        type: 'varchar',
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
            }),
        );

        // 2. Add foreign key to users table
        await queryRunner.createForeignKey(
            'workspaces',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE', // optional, deletes workspace if user is deleted
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key first
        const table = await queryRunner.getTable('workspaces');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('workspaces', foreignKey);
        }

        // Then drop table
        await queryRunner.dropTable('workspaces');
    }

}
