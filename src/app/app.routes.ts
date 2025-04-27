import { Routes } from '@angular/router';
import { ListaInvestimentosComponent } from './features/lista-investimentos/lista-investimentos.component';
import { ResgateComponent } from './features/resgate/resgate.component';
import { NovoInvestimentoComponent } from './features/novo-investimento/novo-investimento.component';

export const routes: Routes = [
  { path: '', redirectTo: 'investimentos', pathMatch: 'full' },
  { path: 'investimentos', component: ListaInvestimentosComponent },
  { path: 'investimentos/novo', component: NovoInvestimentoComponent },
  { path: 'investimentos/:id/visualizar', component: NovoInvestimentoComponent },
  { path: 'investimentos/:id/editar', component: NovoInvestimentoComponent },
  { path: 'investimentos/:id/resgate', component: ResgateComponent },
  { path: '**', redirectTo: 'investimentos' }
];
