import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCoulmnCommentTableTitle1759833104664 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "comments",
            new TableColumn({
                name: "genarate title",
                type: "varchar",
                length: "255",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("comments", "genarate title");
    }
}
