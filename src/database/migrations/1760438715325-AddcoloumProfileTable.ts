import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddcoloumProfileTable1760438715325 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remove old 'name' column
        await queryRunner.dropColumn("profiles", "name");

        // Add new columns
        await queryRunner.addColumns("profiles", [
            new TableColumn({
                name: "first_name",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "last_name",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "city",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "phone",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "education_institution",
                type: "text",
                isNullable: true,
            }),
            new TableColumn({
                name: "skill",
                type: "text",
                isNullable: true,
            }),
            new TableColumn({
                name: "company_url",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "workspace_id",
                type: "int",
                isNullable: true,
            }),
            new TableColumn({
                name: "group_id",
                type: "int",
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("profiles", [
            "first_name",
            "last_name",
            "city",
            "phone",
            "education",
            "skill",
            "company_url",
            "workspace_id",
            "group_id",
        ]);

        await queryRunner.addColumn(
            "profiles",
            new TableColumn({
                name: "name",
                type: "varchar",
                isNullable: true,
            })
        );
    }

}
