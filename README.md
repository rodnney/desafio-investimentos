# Desafio Técnico - Aplicação Angular de Investimentos

Este documento contém um resumo da aplicação desenvolvida para o desafio técnico.

## Estrutura da Aplicação

A aplicação foi desenvolvida em Angular e possui os seguintes componentes:

- **HomeComponent**: Exibe a lista de investimentos disponíveis
- **InvestmentDetailComponent**: Exibe os detalhes de um investimento e permite realizar resgates
- **SuccessModalComponent**: Modal exibido quando um resgate é realizado com sucesso
- **ErrorModalComponent**: Modal exibido quando há erros de validação no resgate

## Funcionalidades Implementadas

- Listagem de investimentos com indicação de carência
- Navegação para a tela de detalhes de investimento
- Cálculo de saldos acumulados por ação
- Validação de valores de resgate
- Exibição de modais de sucesso e erro
- Testes unitários para todos os componentes e serviços

## Tecnologias Utilizadas

- Angular 17
- Bootstrap para estilização
- Karma/Jasmine para testes unitários

## Como Executar

Para executar a aplicação em um ambiente local:

1. Clone o repositório
2. Execute `npm install` para instalar as dependências
3. Execute `ng serve` para iniciar o servidor de desenvolvimento
4. Acesse `http://localhost:4200` no navegador

## Testes

Os testes unitários foram implementados para todos os componentes e serviços. Para Yyexecutar os testes:

```
ng test
```

## Observações

## ajuste para  deploy
ng serve
git add .
git commit -m "Descreva sua alteração"
git push origin main
git checkout main
ng build --configuration production
cd dist/desafio-investimentos/browser
git add .
git commit -m "Deploy: atualização do site"
git push origin gh-pages --force
