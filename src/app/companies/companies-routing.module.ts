import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationGuardService } from '../core';
import { CompaniesComponent } from './companies.component';
import { CompaniesListComponent } from './companies-list.component';
import { EditCompanyComponent } from './edit-company.component';
import { NewCompanyComponent } from './new-company.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'companies',
        component: CompaniesComponent,
        canActivate: [ AuthenticationGuardService ],
        children: [
          { path: 'new',      component: NewCompanyComponent    },
          { path: ':companyId/users',  loadChildren: 'app/users/users.module#UsersModule'  },
          { path: ':companyId/area-types', loadChildren: 'app/area-types/area-types.module#AreaTypesModule' },
          { path: ':companyId/modules',  loadChildren: 'app/modules/modules.module#ModulesModule' },
          { path: ':companyId/options-lists',  loadChildren: 'app/options-lists/options-lists.module#OptionsListsModule' },
          { path: ':id/edit', component: EditCompanyComponent   },
          { path: '',         component: CompaniesListComponent },
        ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class CompaniesRoutingModule {
}
