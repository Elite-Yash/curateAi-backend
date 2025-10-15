import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCoulmnsInCommentsTable1759748197198 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("comments", [
            new TableColumn({
                name: "motive",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "tone",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "language",
                type: "varchar",
                isNullable: true,
            }),
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ['saved', "published"],
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("comments", "motive");
        await queryRunner.dropColumn("comments", "tone");
        await queryRunner.dropColumn("comments", "language");
        await queryRunner.dropColumn("comments", "status");
    }

}
