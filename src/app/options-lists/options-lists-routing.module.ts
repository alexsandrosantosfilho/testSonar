import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationGuardService } from '../core';
import { OptionsListsComponent } from './options-lists.component';
import { EditOptionsListComponent } from './edit-options-list.component';
import { NewOptionsListComponent } from './new-options-list.component';
import { OptionsListsListComponent } from './options-lists-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OptionsListsComponent,
        canActivate: [ AuthenticationGuardService ],
        children: [
          { path: 'new',      component: NewOptionsListComponent   },
          { path: ':id/edit', component: EditOptionsListComponent  },
          { path: '',         component: OptionsListsListComponent }
        ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class OptionsListsRoutingModule {
}
