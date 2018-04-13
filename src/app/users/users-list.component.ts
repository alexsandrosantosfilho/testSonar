import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
const notify = require('devextreme/ui/notify');

import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';
import { User } from './user';
import { UsersService } from './users.service';

@Component({
  selector: 'sgt2-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {

  company: Company;
  users: User[] = [];
  loading = true;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.loadCompany(params['companyId']);
    });
  }

  deleteUser(user: User) {
    if (confirm(`Deseja realmente excluir o usuário "${user.name}"?`)) {
      this.usersService
        .deleteUser(user.id)
        .subscribe(() => {
          const index: number = this.users.indexOf(user);

          if (index >= 0) {
            this.users.splice(index, 1);
          }

          notify({
            message: `O usuário "${user.name}" foi excluído com sucesso.`,
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
        this.loadUsers();
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

  private loadUsers() {
    this.usersService
      .getUsers(this.company.id)
      .subscribe((users: User[]) => {
        this.users = users;
        this.loading = false;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
