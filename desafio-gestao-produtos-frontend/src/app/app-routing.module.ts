import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutosComponent } from './views/produtos/produtos.component';
import { CadastroProdutoComponent } from './views/cadastro-produto/cadastro-produto.component';

const routes: Routes = [
  { path: '', redirectTo: 'produto', pathMatch: 'full' },
  { path: 'produto', component: ProdutosComponent },
  { path: 'produto/cadastro', component: CadastroProdutoComponent },
  { path: 'produto/cadastro/:id', component: CadastroProdutoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
