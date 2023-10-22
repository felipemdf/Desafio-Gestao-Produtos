// import { Loja } from 'src/resources/lojas/entities/loja.entity';
import { Loja } from 'src/resources/lojas/entities/loja.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProdutoLoja } from './produtoLoja.entity';
// import { Produtoloja } from './produtoloja.entity';

@Entity('produto')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;

  @Column({ type: 'numeric', precision: 10, scale: 3 })
  custo: number;

  @Column({ type: 'bytea', nullable: true })
  imagem: Buffer;

  @OneToMany(() => ProdutoLoja, (produtoLoja) => produtoLoja.produto)
  produtoLojas: ProdutoLoja[];
}
