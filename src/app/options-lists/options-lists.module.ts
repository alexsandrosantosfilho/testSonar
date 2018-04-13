import { NgModule } from '@angular/core';

import { OptionsListsRoutingModule } from './options-lists-routing.module';
import { OptionsListsListComponent } from './options-lists-list.component';
import { OptionsListFormComponent } from './options-list-form.component';
import { OptionsListsComponent } from './options-lists.component';
import { OptionsListsService } from './options-lists.service';
import { OptionFormComponent } from './option-form.component';
import { NewOptionsListComponent } from './new-options-list.component';
import { EditOptionsListComponent } from './edit-options-list.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    OptionsListsRoutingModule
  ],
  declarations: [
    OptionsListsListComponent,
    OptionsListsComponent,
    OptionsListFormComponent,
    OptionFormComponent,
    NewOptionsListComponent,
    EditOptionsListComponent
  ],
  providers: [
    OptionsListsService
  ]
})
export class OptionsListsModule {
}
