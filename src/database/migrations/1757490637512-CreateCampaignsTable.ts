import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCampaignsTable1757490637512 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "campaigns",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "url",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: ['message', 'connect', 'endorse', 'view'],
                        isNullable: false,
                    },
                    {
                        name: "message",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ['active', 'inactive'],
                        default: "'active'",
                        isNullable: false,
                    },
                    {
                        name: "import_type",
                        type: "enum",
                        enum: ['csv', 'url'],
                        isNullable: false,
                    },
                    {
                        name: "max_connections",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "file",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "user_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        // Add foreign key constraint
        await queryRunner.createForeignKey(
            "campaigns",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // First drop the foreign key constraint
        const table = await queryRunner.getTable("campaigns");
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("campaigns", foreignKey);
        }
        
        // Then drop the table
        await queryRunner.dropTable("campaigns");
    }

}