import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateCommentTypeAndPostUrl1758620873150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Make post_url nullable
        await queryRunner.query(`
      ALTER TABLE \`comments\`
      MODIFY COLUMN \`post_url\` VARCHAR(255) NULL
    `);

        // 2. Temporarily convert comment_type to VARCHAR
        await queryRunner.query(`
      ALTER TABLE \`comments\`
      MODIFY COLUMN \`comment_type\` VARCHAR(50) NOT NULL
    `);

        // 3. Update existing data to new ENUM values
        await queryRunner.query(`
      UPDATE \`comments\`
      SET \`comment_type\` = CASE
        WHEN \`comment_type\` = 'reply' THEN 'comment-reply'
        WHEN \`comment_type\` = 'post' THEN 'create-post'
        WHEN \`comment_type\` = 'message' THEN 'message-reply'
        ELSE \`comment_type\`
      END
    `);

        // 4. Convert column to ENUM with new values
        await queryRunner.query(`
      ALTER TABLE \`comments\`
      MODIFY COLUMN \`comment_type\` ENUM(
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
        // revert ENUM back to old values
        await queryRunner.query(`
      ALTER TABLE \`comments\`
      MODIFY COLUMN \`comment_type\` VARCHAR(50) NOT NULL
    `);

        await queryRunner.query(`
      UPDATE \`comments\`
      SET \`comment_type\` = CASE
        WHEN \`comment_type\` = 'comment-reply' THEN 'reply'
        WHEN \`comment_type\` = 'create-post' THEN 'post'
        WHEN \`comment_type\` = 'message-reply' THEN 'message'
        ELSE \`comment_type\`
      END
    `);

        await queryRunner.query(`
      ALTER TABLE \`comments\`
      MODIFY COLUMN \`comment_type\` ENUM('reply', 'post', 'message') NOT NULL
    `);

        // revert post_url to NOT NULL
        await queryRunner.query(`
      ALTER TABLE \`comments\`
      MODIFY COLUMN \`post_url\` VARCHAR(255) NOT NULL
    `);
    }
}
