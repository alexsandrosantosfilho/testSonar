import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { AreaType } from '../area-types/area-type';
import { AreaTypesService } from '../area-types/area-types.service';
import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';
import { Status } from './status';

@Component({
  selector: 'sgt2-new-status',
  templateUrl: './new-status.component.html'
})
export class NewStatusComponent implements OnInit {

  company: Company;
  companyId: string;
  areaType: AreaType;
  areaTypeId: number;
  status: Status;
  submiting = true;
  validated = false;

  constructor(
    private areaTypeService: AreaTypesService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.parent.parent.snapshot.params['companyId'];
    this.areaTypeId = +this.route.parent.snapshot.params['areaTypeId'];
    this.loadCompany(this.companyId);
    this.loadAreaType(this.companyId, this.areaTypeId);
  }

  onSaveStatus(status: Status) {
    this.status = status;

    notify({
      message: `Os dados do status "${status.name}" foram salvos com sucesso.`,
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
