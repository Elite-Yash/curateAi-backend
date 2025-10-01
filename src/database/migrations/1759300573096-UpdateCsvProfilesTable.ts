import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateCsvProfilesTable1759300573096 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Drop profile_img column
        await queryRunner.dropColumn("csv_profiles", "profile_img");

        // 2. Add email column
        await queryRunner.addColumn(
            "csv_profiles",
            new TableColumn({
                name: "email",
                type: "varchar",
                length: "255",
                isNullable: true, // optional field
            })
        );

        // 3. Add position column
        await queryRunner.addColumn(
            "csv_profiles",
            new TableColumn({
                name: "position",
                type: "varchar",
                length: "255",
                isNullable: true,
            })
        );

        // 4. Add organization column
        await queryRunner.addColumn(
            "csv_profiles",
            new TableColumn({
                name: "organization",
                type: "varchar",
                length: "255",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Drop the new columns
        await queryRunner.dropColumn("csv_profiles", "email");
        await queryRunner.dropColumn("csv_profiles", "position");
        await queryRunner.dropColumn("csv_profiles", "organization");

        // 2. Add profile_img column back
        await queryRunner.addColumn(
            "csv_profiles",
            new TableColumn({
                name: "profile_img",
                type: "varchar",
                length: "255",
                isNullable: true,
            })
        );
    }

}
