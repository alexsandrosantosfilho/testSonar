import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
const notify = require('devextreme/ui/notify');

import { OptionsList } from './options-list';
import { OptionsListsService } from './options-lists.service';
import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'sgt2-options-lists-list',
  templateUrl: './options-lists-list.component.html'
})
export class OptionsListsListComponent implements OnInit {

  company: Company;
  optionsLists: OptionsList[] = [];
  loading = true;

  constructor(
    private optionsListsService: OptionsListsService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.loadCompany(params['companyId']);
    });
  }

  deleteOptionsList(optionsList: OptionsList) {
    if (confirm(`Deseja realmente excluir a lista de opções "${optionsList.name}"?`)) {
      this.optionsListsService
        .deleteOptionsList(this.company.id, optionsList.id)
        .subscribe(() => {
          const index: number = this.optionsLists.indexOf(optionsList);

          if (index >= 0) {
            this.optionsLists.splice(index, 1);
          }

          notify({
            message: `A lista de opções "${optionsList.name}" foi excluído com sucesso.`,
            type: 'success',
            displayTime: 1500,
            maxWidth: '500px'
          });
        }, (error: any) => {
          // TODO: Handle error
          console.warn(error);
        });
    }
  }

  private loadCompany(companyId: string) {
    this.companiesService
      .getCompany(companyId)
      .subscribe((company: Company) => {
        this.company = company;
        this.loadOptionsLists();
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

  private loadOptionsLists() {
    this.optionsListsService
      .getOptionsLists(this.company.id)
      .subscribe((optionsLists: OptionsList[]) => {
        this.optionsLists = optionsLists;
        this.loading = false;
      }, (error) => {
        // TODO: Handle error
        console.warn(error);
        this.loading = false;
      });
  }

}
