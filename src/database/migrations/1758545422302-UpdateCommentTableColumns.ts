import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateCommentTableColumns1758545422302
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Update post_url to be nullable
    await queryRunner.changeColumn(
      'comments',
      'post_url',
      new TableColumn({
        name: 'post_url',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    // 2. Update comment_type enum
    await queryRunner.query(`
      ALTER TABLE comments 
      MODIFY comment_type ENUM(
        'comment-reply', 
        'comment', 
        'article-comment', 
        'article-comment-reply', 
        'message-reply', 
        'create-post'
      ) NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert post_url to NOT NULL
    await queryRunner.changeColumn(
      'comments',
      'post_url',
      new TableColumn({
        name: 'post_url',
        type: 'varchar',
        length: '255',
        isNullable: false,
      }),
    );

    // Revert comment_type enum to old values
    await queryRunner.query(`
      ALTER TABLE comments 
      MODIFY comment_type ENUM('reply', 'post', 'message') NOT NULL
      console.log("  ~ UpdateCommentTableColumns1758545422302 ~ down ~ NULL:", NULL)
    `);
  }
}
