import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationGuardService } from '../core';
import { StatusesComponent } from './statuses.component';
import { EditStatusComponent } from './edit-status.component';
import { NewStatusComponent } from './new-status.component';
import { StatusesListComponent} from './statuses-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: StatusesComponent,
        canActivate: [ AuthenticationGuardService ],
        children: [
          { path: 'new',      component: NewStatusComponent   },
          { path: ':id/edit', component: EditStatusComponent  },
          { path: '',         component: StatusesListComponent }
        ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class StatusesRoutingModule {
}
