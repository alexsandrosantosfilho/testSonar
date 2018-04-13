import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
const notify = require('devextreme/ui/notify');

import { Module } from './module';
import { Company } from '../companies/company';
import { ModulesService } from './modules.service';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'sgt2-edit-module',
  templateUrl: './edit-module.component.html'
})
export class EditModuleComponent implements OnInit {

  company: Company;
  modules: any[] = [];
  loading = true;
  module: Module = <Module>{};
  companyId: string;
  moduleId: string;
  submiting = true;

  constructor(
    private moduleService: ModulesService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.snapshot.params['companyId'];
    this.loadCompany(this.companyId);

    this.route.params.subscribe(params => {
      this.moduleId = params['id'];
    });

    this.route.params.subscribe((params: Params) => {
      this.loadModule(this.companyId, this.moduleId);
    });
  }

  onSaveModule(module: Module) {
    this.module = module;
    this.location.back();

    notify({
      message: `Os dados do módulo "${module.label}" foram salvos com sucesso.`,
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

  private loadModule(companyId: string, moduleId: string) {
    this.moduleService
      .getModule(companyId, moduleId)
      .subscribe((module: Module) => {
        this.module = module;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
