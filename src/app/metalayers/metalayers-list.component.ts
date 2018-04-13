import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { AreaType } from '../area-types/area-type';
import { AreaTypesService } from '../area-types/area-types.service';
import { MetalayersService } from './metalayers.service';
import { Metalayer } from './metalayer';
import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'sgt2-metalayers',
  templateUrl: './metalayers-list.component.html'
})
export class MetalayersListComponent implements OnInit {

  company: Company;
  companyId: string;
  areaType: AreaType;
  areaTypeId: number;
  metalayers: Metalayer[] = [];
  loading = true;

  constructor(
    private areaTypeService: AreaTypesService,
    private companiesService: CompaniesService,
    private location: Location,
    private metalayersService: MetalayersService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.parent.parent.snapshot.params['companyId'];
    this.loadCompany(this.companyId);
    this.route.params.subscribe((params: Params) => {
      this.areaTypeId = +params['areaTypeId'];
      this.loadAreaType(this.companyId, this.areaTypeId);
    });
  }

  deleteMetalayer(metalayer: Metalayer) {
    if (confirm(`Deseja realmente excluir o meta camada "${metalayer.name}"?`)) {
      this.metalayersService
        .deleteMetalayer(this.companyId, this.areaTypeId, metalayer.id)
        .subscribe(() => {
          const index: number = this.metalayers.indexOf(metalayer);

          if (index >= 0) {
            this.metalayers.splice(index, 1);
          }

          notify({
            message: `A meta camada "${metalayer.name}" foi excluída com sucesso.`,
            type: 'success',
            displayTime: 2500,
            maxWidth: '500px'
          });
        }, (error: any) => {
          // TODO: Handle error
          console.warn(error);
        });
    }
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
        this.loadMetalayers(companyId, areaTypeId);
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

  private loadMetalayers(companyId: string, areaTypeId: number) {
    this.metalayersService
      .getMetalayers(companyId, areaTypeId)
      .subscribe((metalayers: Metalayer[]) => {
        this.metalayers = metalayers;
        this.loading = false;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
