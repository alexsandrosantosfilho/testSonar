import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { FormFieldMetadata } from '../shared/components/dynamic-form/form-field';
import { AreaType } from '../area-types/area-type';
import { AreaTypesService } from '../area-types/area-types.service';
import { Metalayer } from './metalayer';
import { MetalayerFormComponent } from './metalayer-form.component';
import { MetalayersService } from './metalayers.service';
import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'sgt2-edit-metalayer',
  templateUrl: './edit-metalayer.component.html'
})
export class EditMetalayerComponent implements OnInit {

  company: Company;
  companyId: string;
  areaType: AreaType;
  areaTypeId: number;
  metalayer: any;
  submiting = true;

  constructor(
    private areaTypeService: AreaTypesService,
    private companiesService: CompaniesService,
    private metalayersService: MetalayersService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.companyId = this.route.parent.parent.parent.snapshot.params['companyId'];
    this.areaTypeId = +this.route.parent.snapshot.params['areaTypeId'];
    this.loadCompany(this.companyId);
    this.loadAreaType(this.companyId, this.areaTypeId);

    this.route.params.subscribe((params: Params) => {
      this.loadMetalayer(this.companyId, this.areaTypeId, +params['id']);
    });
  }

  onSaveMetalayer(metalayer: Metalayer) {
    this.location.back();

    notify({
      message: `Os dados da meta camada foram salvos com sucesso.`,
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

  private loadMetalayer(companyId: string, areaTypeId: number, id: number) {
    this.metalayersService
      .getMetalayer(companyId, areaTypeId, id)
      .subscribe((metalayer: Metalayer) => {
        this.metalayer = metalayer;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
