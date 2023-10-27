import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Loja } from 'src/app/models/loja.model';
import { LojaService } from 'src/app/services/loja.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ProdutoLoja } from 'src/app/models/produtoLoja.model';

@Component({
  selector: 'app-preco-loja-dialog',
  templateUrl: './preco-loja-dialog.component.html',
  styleUrls: ['./preco-loja-dialog.component.css'],
})
export class PrecoLojaDialogComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PrecoLojaDialogComponent>,
    private lojaService: LojaService,
    private snackbar: SnackbarService,

    @Inject(MAT_DIALOG_DATA) public data: ProdutoLoja
  ) {}

  opcoesLojas: Loja[] = [];
  formControl!: FormGroup;

  ngOnInit(): void {
    this.configForm();

    this.lojaService.findAll().subscribe((data: Loja[]) => {
      this.opcoesLojas = data;
    });

    if (this.data) {
      this.formControl.patchValue(this.data);
    }
  }

  configForm() {
    this.formControl = this.formBuilder.group({
      idLoja: new FormControl(null, [Validators.required]),
      descricao: new FormControl(null, [Validators.required]),
      precoVenda: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  udpdateDescricao(event: any) {
    const idLoja = event.value;
    const lojaSelecionada = this.opcoesLojas.find((loja) => loja.id === idLoja);

    this.formControl.get('descricao')!.setValue(lojaSelecionada!.descricao);
  }

  submit() {
    if (!this.formControl.valid) {
      this.snackbar.showSnackbar(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        5
      );
      return;
    }

    this.dialogRef.close(this.formControl.value);
  }
}
