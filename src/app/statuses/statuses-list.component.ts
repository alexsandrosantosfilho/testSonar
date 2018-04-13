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
  selector: 'sgt2-statuses-list',
  templateUrl: './statuses-list.component.html'
})
export class StatusesListComponent implements OnInit {

  company: Company;
  companyId: string;
  areaType: AreaType;
  areaTypeId: number;
  statuses: Status[] = [];
  loading = true;

  constructor(
    private areaTypeService: AreaTypesService,
    private companiesService: CompaniesService,
    private statusesService: StatusesService,
    private route: ActivatedRoute,
    private location: Location
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

  deleteStatus(status: Status) {
    if (confirm(`Deseja realmente excluir o status "${status.name}"?`)) {
      this.statusesService
        .deleteStatus(this.companyId, this.areaTypeId, status.id)
        .subscribe(() => {
          const index: number = this.statuses.indexOf(status);

          if (index >= 0) {
            this.statuses.splice(index, 1);
          }

          notify({
            message: `O status "${status.name}" foi excluído com sucesso.`,
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
        this.loadStatuses(companyId, areaTypeId);
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

  private loadStatuses(companyId: string, areaTypeId: number) {
    this.statusesService
      .getStatuses(companyId, areaTypeId)
      .subscribe((statuses: Status[]) => {
        this.statuses = statuses;
        this.loading = false;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
