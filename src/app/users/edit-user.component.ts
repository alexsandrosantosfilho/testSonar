import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';
import { User } from './user';
import { UsersService } from './users.service';

@Component({
  selector: 'sgt2-edit-user',
  templateUrl: './edit-user.component.html'
})
export class EditUserComponent implements OnInit {

  company: Company;
  companyId: string;
  user: User;
  submiting = true;

  constructor(
    private companiesService: CompaniesService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.snapshot.params['companyId'];
    this.loadCompany(this.companyId);
    this.route.params.subscribe((params: Params) => {
      this.loadUser(this.companyId, params['id']);
    });
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

  private loadUser(companyId: string, userId: string) {
    this.usersService
      .getUser(userId)
      .subscribe((user: User) => {
        this.user = user;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
