import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateUserTable1746521643855 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "is_email_verified",
                type: "boolean",
                isNullable: true,
                default: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "is_email_verified");
    }

}
