import { ProdutoLoja } from '../../produtos/entities/produtoLoja.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('loja')
export class Loja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, nullable: false })
  descricao: string;

  @OneToMany(() => ProdutoLoja, (produtoLoja) => produtoLoja.loja)
  produtoLojas: ProdutoLoja[];
}
