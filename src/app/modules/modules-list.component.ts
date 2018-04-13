import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { CompaniesService } from '../companies/companies.service';
import { Company } from '../companies/company';
import { Module } from './module';
import { ModulesService } from './modules.service';

@Component({
  selector: 'sgt2-modules-list',
  templateUrl: './modules-list.component.html'
})
export class ModulesListComponent implements OnInit {

  company: Company;
  modules: any[] = [];
  submiting = false;
  loading = true;

  constructor(
    private companiesService: CompaniesService,
    private moduleService: ModulesService,
    private route: ActivatedRoute,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.loadCompany(params['companyId']);
    });
  }

  onSubmit(module: any) {
    module.settings = JSON.parse(module.settingsJson);
    this.submiting = true;

    this.moduleService
      .updateModule(this.company.id, module)
      .subscribe(() => {

        notify({
          message: `O módulo "${module.label}" foi configurado com sucesso.`,
          type: 'success',
          displayTime: 1500,
          maxWidth: '500px'
        });

        this.submiting = false;
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
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
        this.loadModules();
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

  private loadModules() {
    this.moduleService
      .getModules(this.company.id)
      .subscribe((modules: Module[]) => {
        this.modules = modules;
        this.loading = false;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
        this.loading = false;
      });
  }

}
