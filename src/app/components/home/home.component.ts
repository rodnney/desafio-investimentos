import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvestmentService } from '../../services/investment.service';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, DecimalPipe]
})
export class HomeComponent implements OnInit {
  investments: any[] = [];
  
  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.investmentService.getInvestments().subscribe(
      (data) => {
        this.investments = data.response.data.listaInvestimentos;
      },
      (error) => {
        console.error('Erro ao carregar investimentos:', error);
      }
    );
  }

  navigateToDetail(investment: any): void {
    if (investment.indicadorCarencia === 'N') {
      this.investmentService.setSelectedInvestment(investment);
      this.router.navigate(['/investment-detail']);
    }
  }

  isAvailableForRedemption(investment: any): boolean {
    return investment.indicadorCarencia === 'N';
  }
}
