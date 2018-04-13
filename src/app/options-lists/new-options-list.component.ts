import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { OptionsList } from './options-list';
import { OptionsListFormComponent } from './options-list-form.component';
import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'sgt2-new-options-list',
  templateUrl: './new-options-list.component.html'
})
export class NewOptionsListComponent implements OnInit {

  company: Company;
  companyId: string;
  submiting = true;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.snapshot.params['companyId'];
    this.loadCompany(this.companyId);
  }

  onSaveOptionsList(optionsList: OptionsList) {
    this.location.back();

    notify({
      message: `Os dados da lista de opções "${optionsList.name}" foram salvos com sucesso.`,
      type: 'success',
      displayTime: 1500,
      maxWidth: '500px'
    });
  }

  onCancel() {
    this.location.back();
  }

  private loadCompany(companyId: string) {
    this.companiesService
      .getCompany(companyId)
      .subscribe((company: Company) => {
        this.company = company;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
