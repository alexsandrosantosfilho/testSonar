import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { Company } from '../companies/company';
import { CompaniesService } from '../companies/companies.service';
import { OptionsList } from './options-list';
import { OptionsListsService } from './options-lists.service';

@Component({
  selector: 'sgt2-edit-options-list',
  templateUrl: './edit-options-list.component.html'
})
export class EditOptionsListComponent implements OnInit {

  company: Company;
  companyId: string;
  optionsList: OptionsList;
  submiting = true;

  constructor(
    private companiesService: CompaniesService,
    private optionsListsService: OptionsListsService,
    private route: ActivatedRoute,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.companyId = this.route.parent.snapshot.params['companyId'];
    this.loadCompany(this.companyId);
    this.route.params.subscribe((params: Params) => {
      this.loadOptionsList(this.companyId, params['id']);
    });
  }

  onSaveOptionsList(optionsList: OptionsList) {
    this.location.back();

    notify({
      message: `Os dados da lista de opções "${optionsList.name}" foram salvos com sucesso.`,
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

  private loadOptionsList(companyId: string, optionsListId: number) {
    this.optionsListsService
      .getOptionsList(companyId, optionsListId)
      .subscribe((optionsList: OptionsList) => {
        this.optionsList = optionsList;
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
      });
  }

}
