import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableProduct1678189577114 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE "product" ADD "descricao" character varying NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE "product" drop "descricao";
        `);
  }
}
