import { Component } from '@angular/core';
import { Location } from '@angular/common';
const notify = require('devextreme/ui/notify');

import { Company } from './company';
import { ContextService } from '../core';

@Component({
  selector: 'sgt2-new-company',
  templateUrl: './new-company.component.html'
})
export class NewCompanyComponent {

  company: Company;

  constructor(
    private location: Location,
    private contextService: ContextService
  ) {
  }

  onSaveCompany(company: Company) {
    this.company = company;

    notify({
      message: `Os dados da empresa "${company.name}" foram salvos com sucesso.`,
      type: 'success',
      displayTime: 1500,
      maxWidth: '500px'
    });
  }

  onCancel() {
    this.location.back();
  }

}
