import { NgModule } from '@angular/core';

import { CompaniesComponent } from './companies.component';
import { CompaniesListComponent } from './companies-list.component';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesService } from './companies.service';
import { CompanyFormComponent } from './company-form.component';
import { EditCompanyComponent } from './edit-company.component';
import { NewCompanyComponent } from './new-company.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    CompaniesRoutingModule,
    SharedModule
  ],
  declarations: [
    CompaniesComponent,
    CompaniesListComponent,
    CompanyFormComponent,
    NewCompanyComponent,
    EditCompanyComponent
  ],
  providers: [
    CompaniesService
  ]
})
export class CompaniesModule {
}
