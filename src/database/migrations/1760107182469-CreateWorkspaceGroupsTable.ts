import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateWorkspaceGroupsTable1760107182469 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'workspace_groups',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'workspace_id',
                        type: 'int',
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

        await queryRunner.createForeignKey(
            'workspace_groups',
            new TableForeignKey({
                columnNames: ['workspace_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'workspaces',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('workspace_groups');
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('workspace_id') !== -1,
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey('workspace_groups', foreignKey);
        }

        await queryRunner.dropTable('workspace_groups');
    }

}
