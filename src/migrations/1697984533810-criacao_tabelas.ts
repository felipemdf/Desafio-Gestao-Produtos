import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriacaoTabelas1697984533810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "produto" (
        "id" SERIAL PRIMARY KEY, 
        "descricao" VARCHAR(60) NOT NULL, 
        "custo" NUMERIC(10,3), 
        "imagem" BYTEA
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "loja" (
        "id" SERIAL PRIMARY KEY, 
        "descricao" VARCHAR(60) NOT NULL
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "produtoLoja" (
        "idProduto" INT NOT NULL, 
        "idLoja" INT NOT NULL,
        "precoVenda" NUMERIC(10,3),

        CONSTRAINT "FK_produtoLoja_produto" 
            FOREIGN KEY ("idProduto") 
            REFERENCES "produto" ("id")
            ON DELETE CASCADE,

        CONSTRAINT "FK_produtoLoja_loja" 
            FOREIGN KEY ("idLoja") 
            REFERENCES "loja" ("id")
            ON DELETE CASCADE
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "produtoloja";');
    await queryRunner.query('DROP TABLE "produto";');
    await queryRunner.query('DROP TABLE "loja";');
  }
}
