import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ListaInvestimentosComponent } from './features/lista-investimentos/lista-investimentos.component';
import { ResgateComponent } from './features/resgate/resgate.component';
import { NovoInvestimentoComponent } from './features/novo-investimento/novo-investimento.component';
import { MoedaPipe } from './shared/pipes/moeda.pipe';
import { CurrencyInputDirective } from './shared/directives/currency-input.directive';
import { NumeroDirective } from './shared/directives/numero.directive';
import { ErroModalComponent } from './shared/components/modals/erro-modal/erro-modal.component';
import { SucessoModalComponent } from './shared/components/modals/sucesso-modal/sucesso-modal.component';
import { HeaderComponent } from './shared/components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ListaInvestimentosComponent,
    ResgateComponent,
    NovoInvestimentoComponent,
    MoedaPipe,
    CurrencyInputDirective,
    NumeroDirective,
    ErroModalComponent,
    SucessoModalComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
