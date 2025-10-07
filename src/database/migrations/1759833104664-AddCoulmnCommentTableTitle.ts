import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnCommentTableTitle1759833104664 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "comments",
            new TableColumn({
                name: "genarate_title",
                type: "text",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("comments", "genarate_title");
    }
}
