import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Company } from './company';
import { CompaniesService } from './companies.service';
import { ContextService } from '../core';
import { StrongConfirmationModalComponent } from '../shared';

@Component({
  selector: 'sgt2-companies-list',
  templateUrl: './companies-list.component.html'
})
export class CompaniesListComponent implements OnInit {

  companies: Company[] = [];
  loading = true;

  @ViewChild('strongConfirmationModal')
  private strongConfirmationModal: StrongConfirmationModalComponent;

  constructor(
    private companiesService: CompaniesService,
    private contextService: ContextService
  ) {
  }

  ngOnInit() {
    this.loadCompanies();
  }

  deleteCompany(company: Company) {
    this.strongConfirmationModal.open(
      'Confirmação',
      `<p>Deseja realmente excluir a empresa <strong>"${company.name}"</strong>?</p>Todos os dados relacionados à esta empresa serão removidos.`,
      'Confirmar exclusão',
      company
    );
  }

  onConfirmDelete(company: Company) {
    this.companiesService
      .deleteCompany(company)
      .subscribe((deleted: boolean) => {
      }, (error) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

  private loadCompanies() {
    this.companiesService
    .getCompanies()
    .subscribe((companies: Company[]) => {
      this.companies = companies;
      this.loading = false;
    }, (error) => {
      // TODO: Handle error
      console.warn(error);
      this.loading = false;
    });
  }

}
