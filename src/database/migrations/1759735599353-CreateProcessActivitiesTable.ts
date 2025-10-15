import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProcessActivitiesTable1759735599353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "process_activities",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "automation_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "user_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "profile_id",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["incomplete", "in progress", "completed"],
                        isNullable: false,
                        default: "'incomplete'",
                    },
                    {
                        name: "message",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
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
                    {
                        name: "deleted_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("process_activities");
    }
}
