import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Produto } from './produto.entity';
import { Loja } from 'src/resources/lojas/entities/loja.entity';

@Entity('produtoLoja')
export class ProdutoLoja {
  @PrimaryColumn()
  idProduto: number;

  @PrimaryColumn()
  idLoja: number;

  @Column('numeric', { precision: 10, scale: 3 })
  precoVenda: number;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'idProduto' })
  produto: Produto;

  @ManyToOne(() => Loja)
  @JoinColumn({ name: 'idLoja' })
  loja: Loja;
}
