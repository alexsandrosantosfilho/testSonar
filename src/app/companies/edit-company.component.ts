import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
const notify = require('devextreme/ui/notify');

import { Company } from './company';
import { CompanyFormComponent } from './company-form.component';
import { CompaniesService } from './companies.service';
import { ContextService } from '../core';

@Component({
  selector: 'sgt2-edit-company',
  templateUrl: './edit-company.component.html'
})
export class EditCompanyComponent implements OnInit {

  company: Company;
  submiting = true;

  constructor(
    private companiesService: CompaniesService,
    private contextService: ContextService,
    private route: ActivatedRoute,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.loadCompany(params['id']);
    });
  }

  onSaveCompany(company: Company) {
    this.company = company;

    notify({
      message: `Os dados da empresa "${company.name}" foram salvos com sucesso.`,
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
