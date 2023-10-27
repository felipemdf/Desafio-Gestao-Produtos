import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';

import { ProdutosComponent } from './views/produtos/produtos.component';
import { CadastroProdutoComponent } from './views/cadastro-produto/cadastro-produto.component';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';

import {
  NgxMaskDirective,
  provideNgxMask,
  provideEnvironmentNgxMask,
} from 'ngx-mask';
import { PrecoLojaDialogComponent } from './shared/dialogs/preco-loja-dialog/preco-loja-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    AppComponent,
    ProdutosComponent,
    CadastroProdutoComponent,
    PrecoLojaDialogComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatSortModule,
    MatNativeDateModule,
    FormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatGridListModule,
    NgxMaskDirective,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [provideEnvironmentNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
