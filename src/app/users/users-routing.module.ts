import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationGuardService } from '../core';
import { UsersComponent } from './users.component';
import { EditUserComponent } from './edit-user.component';
import { NewUserComponent } from './new-user.component';
import { UsersListComponent} from './users-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: UsersComponent,
        canActivate: [ AuthenticationGuardService ],
        children: [
          { path: 'new',      component: NewUserComponent   },
          { path: ':id/edit', component: EditUserComponent  },
          { path: '',         component: UsersListComponent }
        ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class UsersRoutingModule {
}
