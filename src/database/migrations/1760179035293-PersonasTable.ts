import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class PersonasTable1760179035293 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "personas",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: "personas_name",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "personas_bio",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "jobTitle",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "company",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "industry",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "isdefault",
                        type: "boolean",
                        default: false,
                        isNullable: false,
                    }
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("personas");
    }

}
