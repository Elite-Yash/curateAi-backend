import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveFileCoulmnFromCampaignsTable1758802797091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("campaigns", "file");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "campaigns",
            new TableColumn({
                name: "file",
                type: "int",
                isNullable: true,
            })
        );
    }
}
