import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from 'src/app/models/produto.model';
import { ProdutoLoja } from 'src/app/models/produtoLoja.model';
import { ProdutoService } from 'src/app/services/produto.service';
import { PrecoLojaDialogComponent } from 'src/app/shared/dialogs/preco-loja-dialog/preco-loja-dialog.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css'],
  providers: [ProdutoService],
})
export class CadastroProdutoComponent implements OnInit {
  displayedColumns: string[] = ['descricao', 'precoVenda', 'acoes'];
  dataSource = new MatTableDataSource<ProdutoLoja>();

  formControl!: FormGroup;
  imagemBase64!: string | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.configForm();

    this.route.paramMap.subscribe((params) => {
      const id = +(params.get('id') || '-1');

      if (id != -1) {
        this.produtoService.findOne(id).subscribe(
          (data) => {
            this.fillFormControl(data);

            this.dataSource.data =
              this.formControl.get('produtoLojas')?.value || [];
          },
          (error) => {
            this.snackbar.showSnackbar(error.error.message[0], 5);
            console.error(error.error);
          }
        );
      }
    });
  }

  configForm() {
    this.formControl = this.formBuilder.group({
      id: null,
      descricao: [null, Validators.required],
      custo: [null],
      produtoLojas: this.formBuilder.array<ProdutoLoja>(
        [],
        Validators.required
      ),
    });
  }

  fillFormControl(data: Produto) {
    this.formControl.patchValue({
      id: data.id,
      descricao: data.descricao,
      custo: data.custo,
    });

    this.imagemBase64 = data.imagem || null;

    data.produtoLojas.forEach((produtoLoja: ProdutoLoja) => {
      (this.formControl.get('produtoLojas') as FormArray).push(
        this.formBuilder.group({
          idLoja: produtoLoja.idLoja,
          descricao: [produtoLoja.descricao, Validators.required],
          precoVenda: [produtoLoja.precoVenda, Validators.required],
        })
      );
    });
  }

  updateTable(produtoLojas?: ProdutoLoja[]) {
    if (!produtoLojas) {
      const produtoLojasForm = this.formControl.get(
        'produtoLojas'
      ) as FormArray;
      produtoLojas = produtoLojasForm.value;
    }

    this.dataSource.data = produtoLojas!;
  }

  validatePrecoLojas(
    produtoLojasForm: ProdutoLoja[],
    novoPrecoLoja: ProdutoLoja
  ): boolean {
    const isValido = !produtoLojasForm.some(
      (produtoLoja) => produtoLoja.idLoja == novoPrecoLoja.idLoja
    );

    if (!isValido) {
      this.snackbar.showSnackbar(
        'Não é permitido mais que um preço de venda para a mesma loja.',
        5
      );
      return false;
    }

    return true;
  }

  openDialog(data?: ProdutoLoja): void {
    const dialogRef = this.dialog.open(PrecoLojaDialogComponent, {
      data: data,
      width: '60%',
      height: '50%',
    });

    dialogRef.afterClosed().subscribe((response: ProdutoLoja) => {
      if (!response.idLoja) return;

      this.removePrecoLoja(response.idLoja);
      this.addPrecoLoja(response);
    });
  }

  addPrecoLoja(produtoLoja: ProdutoLoja) {
    const produtoLojasForm = this.formControl.get('produtoLojas') as FormArray;

    if (this.validatePrecoLojas(produtoLojasForm.value, produtoLoja)) {
      produtoLojasForm.push(this.formBuilder.group(produtoLoja));
      this.formControl.patchValue({ produtosLoja: produtoLojasForm.value });

      this.updateTable(produtoLojasForm.value);
    }
  }

  removePrecoLoja(idLoja: number) {
    const produtoLojasForm = this.formControl.get('produtoLojas') as FormArray;
    const index = produtoLojasForm.controls.findIndex(
      (control) => control.value.idLoja === idLoja
    );

    if (index !== -1) {
      produtoLojasForm.removeAt(index);
      this.formControl.patchValue({ produtosLoja: produtoLojasForm.value });

      this.updateTable(this.formControl.value.produtoLojas);
    }
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files![0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagemBase64 = (e.target?.result as String).replace(
          'C:\\fakepath\\',
          ''
        );
      };

      reader.readAsDataURL(file);
    }
  }

  onRemoveImage() {
    this.imagemBase64 = null;
  }

  deleteProduto() {
    const id = this.formControl.get('id')?.value;

    if (!id) {
      this.snackbar.showSnackbar('Não é possível excluir o produto', 5);
      return;
    }

    this.produtoService.delete(id).subscribe(
      () => {
        this.snackbar.showSnackbar('Produto removido com sucesso', 5);

        this.router.navigate(['/produto']);
      },
      (error) => {
        this.snackbar.showSnackbar(error.error.message[0], 5);
        console.error(error.error);
      }
    );
  }

  submit() {
    if (!this.formControl.valid) {
      this.snackbar.showSnackbar(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        5
      );
      return;
    }

    this.produtoService
      .create({ ...this.formControl.value, imagem: this.imagemBase64 })
      .subscribe(
        () => {
          this.router.navigate(['/produto']);
        },
        (error) => {
          this.snackbar.showSnackbar(error.error.message[0], 5);
          console.error(error.error);
        }
      );
  }
}
