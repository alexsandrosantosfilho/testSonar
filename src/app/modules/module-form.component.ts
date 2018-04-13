import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { Module } from './module';
import { Company } from '../companies/company';
import { ModulesService } from './modules.service';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'sgt2-module-form',
  templateUrl: './module-form.component.html'
})
export class ModuleFormComponent implements OnInit {

  @Output() save: EventEmitter<Module> = new EventEmitter<Module>();
  @Output() cancel: EventEmitter<any>  = new EventEmitter<any>();

  @Input() companyId: string;
  @Input() areaTypeId: number;
  @Input() module: Module = <Module>{};

  validated = false;
  company: Company;
  modules: any[] = [];
  loading = true;
  moduleId: string;
  submiting = false;

  constructor(
    private modulesService: ModulesService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.parent.snapshot.params['companyId'];
    this.loadCompany(this.companyId);

    this.route.params.subscribe(params => {
      this.moduleId = params['id'];
    });

    this.route.params.subscribe((params: Params) => {
      this.loadModule(this.companyId, this.moduleId);
    });
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      this.submiting = true;
      this.update();
    }
  }

  onCancel() {
    this.location.back();
  }

  onModuleChange(module: Module) {
    this.module = module;
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
    this.modulesService
      .getModule(companyId, moduleId)
      .subscribe((module: Module) => {
        this.module = module;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

  private update() {
    this.modulesService
      .updateModule(this.companyId, this.module)
      .subscribe((module: Module) => {
        this.announceSave(module);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private announceSave(module: Module) {
    this.validated = false;
    this.submiting = false;
    this.save.emit(module);
  }

}
