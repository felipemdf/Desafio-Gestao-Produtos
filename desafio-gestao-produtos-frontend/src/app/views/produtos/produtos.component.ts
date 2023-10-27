import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Produto } from 'src/app/models/produto.model';
import { ProdutoService } from 'src/app/services/produto.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
  providers: [ProdutoService],
})
export class ProdutosComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'descricao', 'custo', 'acoes'];

  formControl!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Produto>();

  constructor(
    private router: Router,
    private produtoService: ProdutoService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.configForm();

    this.produtoService.findAll().subscribe((data: Produto[]) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });

    this.loadFilters();
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }

  configForm() {
    this.formControl = this.formBuilder.group({
      codigo: null,
      descricao: null,
      custo: null,
      precoVenda: null,
    });
  }

  loadFilters() {
    this.dataSource.filterPredicate = ((data, filter) => {
      const filtroCodigo = !filter.codigo || data.id == filter.codigo;

      const filtroDescricao =
        !filter.descricao ||
        data.descricao.toLowerCase().includes(filter.descricao);

      const filtroCusto = !filter.custo || data.custo == filter.custo;

      const filtroPrecoVenda =
        !filter.precoVenda ||
        data.produtoLojas.some((pl) => pl.precoVenda == filter.precoVenda);

      return filtroCodigo && filtroDescricao && filtroCusto && filtroPrecoVenda;
    }) as (data: Produto, filter: any) => boolean;

    this.formControl.valueChanges.subscribe((value) => {
      console.log(value.descricao.trim());
      
      const filter = {
        ...value,
        descricao: (value.descricao ? value.descricao.trim().toLowerCase() : null),
      } as string;

      this.dataSource.filter = filter;
    });
  }

  deleteProduto(id: number) {
    this.produtoService.delete(id).subscribe(
      () => {
        this.ngOnInit();
        this.snackbar.showSnackbar('Produto removido com sucesso', 5);
      },
      (error) => {
        this.snackbar.showSnackbar(error.error.message[0], 5);
        console.error(error.error);
      }
    );
  }

  editProduto(id: number) {
    this.router.navigate(['/produto/cadastro', id]);
  }
}
