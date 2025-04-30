import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateEmailColumnInProfilesTable1746014559525 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "profiles", // Table name
            "email", // Column name
            new TableColumn({
                name: "email",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
