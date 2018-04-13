import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { AreaType } from './area-type';
import { AreaTypeFormComponent } from './area-type-form.component';
import { AreaTypesService } from './area-types.service';
import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'sgt2-edit-area-type',
  templateUrl: './edit-area-type.component.html'
})
export class EditAreaTypeComponent implements OnInit {

  company: Company;
  companyId: string;
  areaType: AreaType;
  submiting = true;

  constructor(
    private areaTypeService: AreaTypesService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.snapshot.params['companyId'];
    this.loadCompany(this.companyId);

    this.route.params.subscribe((params: Params) => {
      this.loadAreaType(this.companyId, +params['id']);
    });
  }

  onSaveAreaType(areaType: AreaType) {
    this.location.back();

    notify({
      message: `Os dados do tipo de área "${areaType.name}" foram salvos com sucesso.`,
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

  private loadAreaType(companyId: string, areaTypeId: number) {
    this.areaTypeService
      .getAreaType(companyId, areaTypeId)
      .subscribe((areaType: AreaType) => {
        this.areaType = areaType;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
