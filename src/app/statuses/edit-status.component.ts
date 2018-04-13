import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { AreaType } from '../area-types/area-type';
import { AreaTypesService } from '../area-types/area-types.service';
import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';
import { Status } from './status';
import { StatusesService } from './statuses.service';

@Component({
  selector: 'sgt2-edit-status',
  templateUrl: './edit-status.component.html'
})
export class EditStatusComponent implements OnInit {

  company: Company;
  companyId: string;
  areaType: AreaType;
  areaTypeId: number;
  status: Status;
  submiting = true;

  constructor(
    private areaTypeService: AreaTypesService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private location: Location,
    private statusesService: StatusesService
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.parent.parent.snapshot.params['companyId'];
    this.areaTypeId = +this.route.parent.snapshot.params['areaTypeId'];
    this.loadCompany(this.companyId);
    this.loadAreaType(this.companyId, this.areaTypeId);

    this.route.params.subscribe((params: Params) => {
      this.loadStatus(this.companyId, this.areaTypeId, +params['id']);
    });
  }

  onSaveStatus(status: Status) {
    this.status = status;
    // this.router.navigate(['/empresas', this.companyId, 'tipos-de-area', this.areaTypeId, 'status']);

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

  private loadStatus(companyId: string, areaTypeId: number, id: number) {
    this.statusesService
      .getStatus(companyId, areaTypeId, id)
      .subscribe((status: Status) => {
        this.status = status;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
