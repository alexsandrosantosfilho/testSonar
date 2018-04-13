import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';
import { User } from './user';

@Component({
  selector: 'sgt2-new-user',
  templateUrl: './new-user.component.html'
})
export class NewUserComponent implements OnInit {

  company: Company;
  companyId: string;
  submiting = true;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.snapshot.params['companyId'];
    this.loadCompany(this.companyId);
  }

  onSaveUser(user: User) {
    this.location.back();

    notify({
      message: `Os dados do usuário "${user.name}" foram salvos com sucesso.`,
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
