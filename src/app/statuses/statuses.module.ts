import { NgModule } from '@angular/core';

import { StatusesComponent } from './statuses.component';
import { StatusesRoutingModule } from './statuses-routing.module';
import { StatusesService } from './statuses.service';
import { NewStatusComponent } from './new-status.component';
import { StatusesListComponent } from './statuses-list.component';
import { EditStatusComponent } from './edit-status.component';
import { StatusFormComponent } from './status-form.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    StatusesRoutingModule
  ],
  declarations: [
    StatusesComponent,
    StatusFormComponent,
    NewStatusComponent,
    EditStatusComponent,
    StatusesListComponent
  ],
  providers: [
    StatusesService
  ]
})
export class StatusesModule {
}
