import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
const notify = require('devextreme/ui/notify');

import { AreaType } from './area-type';
import { AreaTypesService } from './area-types.service';
import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';

@Component({
  selector: 'sgt2-area-types',
  templateUrl: './area-types-list.component.html'
})
export class AreaTypesListComponent implements OnInit {

  company: Company;
  areaTypes: AreaType[] = [];
  loading = true;

  constructor(
    private areaTypesService: AreaTypesService,
    private companiesService: CompaniesService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.loadCompany(params['companyId']);
    });
  }

  deleteAreaType(areaType: AreaType) {
    if (confirm(`Deseja realmente excluir o tipo de área "${areaType.name}"?`)) {
      this.areaTypesService
        .deleteAreaType(this.company.id, areaType.id)
        .subscribe(() => {
          const index: number = this.areaTypes.indexOf(areaType);

          if (index >= 0) {
            this.areaTypes.splice(index, 1);
          }

          notify({
            message: `O tipo de área "${areaType.name}" foi excluído com sucesso.`,
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
        this.loadAreaTypes();
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

  private loadAreaTypes() {
    this.areaTypesService
      .getAreaTypes(this.company.id)
      .subscribe((areaTypes: AreaType[]) => {
        this.areaTypes = areaTypes;
        this.loading = false;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
