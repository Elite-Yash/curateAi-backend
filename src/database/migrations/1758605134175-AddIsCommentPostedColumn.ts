import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsCommentPostedColumn1758605134175
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'comments',
      new TableColumn({
        name: 'is_comment_posted',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('comments', 'is_comment_posted');
  }
}
