import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Crm1745213833957 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crm',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            length: '255',
            isNullable: false,
          },
          {
            name: 'crm_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'crm_url',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('crm');
  }
}
