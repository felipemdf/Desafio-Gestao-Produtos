import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeders1698023727431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO loja (id, descricao)
      VALUES
        (1, 'LOJA 1'),
        (2, 'LOJA 2'),
        (3, 'LOJA 3')
      ON CONFLICT (id) DO UPDATE
      SET descricao = excluded.descricao;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM loja WHERE id IN (1, 2, 3)`);
  }
}
