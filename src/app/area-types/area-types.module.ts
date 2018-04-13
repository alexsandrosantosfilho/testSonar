import { NgModule } from '@angular/core';

import { AreaTypesComponent } from './area-types.component';
import { AreaTypesRoutingModule } from './area-types-routing.module';
import { AreaTypesService } from './area-types.service';
import { NewAreaTypeComponent } from './new-area-type.component';
import { FolderFormComponent } from './folder-form.component';
import { AreaTypesListComponent } from './area-types-list.component';
import { EditAreaTypeComponent } from './edit-area-type.component';
import { AreaTypeFormComponent } from './area-type-form.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    AreaTypesRoutingModule
  ],
  declarations: [
    AreaTypesComponent,
    AreaTypeFormComponent,
    NewAreaTypeComponent,
    FolderFormComponent,
    EditAreaTypeComponent,
    AreaTypesListComponent
  ],
  providers: [
    AreaTypesService
  ]
})
export class AreaTypesModule {
}
