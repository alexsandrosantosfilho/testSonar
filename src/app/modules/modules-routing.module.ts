import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationGuardService } from '../core';
import { ModulesComponent } from './modules.component';
import { ModulesListComponent } from './modules-list.component';
import { EditModuleComponent } from './edit-module.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ModulesComponent,
        canActivate: [ AuthenticationGuardService ],
        children: [
          { path: ':id/edit', component: EditModuleComponent   },
          { path: '',         component: ModulesListComponent }
        ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class ModulesRoutingModule {
}
