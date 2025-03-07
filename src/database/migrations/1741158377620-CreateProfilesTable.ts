import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProfilesTable1741158377620 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "profiles",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "user_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: "position",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "organization",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "url",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "profile",
                    type: "text",
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
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("profile");
    }

}
