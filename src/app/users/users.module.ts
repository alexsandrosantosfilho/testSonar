import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersService } from './users.service';
import { UserFormComponent } from './user-form.component';
import { NewUserComponent } from './new-user.component';
import { UsersListComponent } from './users-list.component';
import { EditUserComponent } from './edit-user.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  declarations: [
    UsersComponent,
    UserFormComponent,
    NewUserComponent,
    EditUserComponent,
    UsersListComponent
  ],
  providers: [
    UsersService
  ]
})
export class UsersModule {
}
