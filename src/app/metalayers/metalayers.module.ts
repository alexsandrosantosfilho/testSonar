import { NgModule } from '@angular/core';

import { MetalayersComponent } from './metalayers.component';
import { MetalayersRoutingModule } from './metalayers-routing.module';
import { MetalayersService } from './metalayers.service';
import { MapServiceService } from './map-service.service';
import { NewMetalayerComponent } from './new-metalayer.component';
import { MetalayersListComponent } from './metalayers-list.component';
import { EditMetalayerComponent } from './edit-metalayer.component';
import { MetalayerFormComponent } from './metalayer-form.component';
import { FieldResourcesFormComponent } from './field-resources-form.component';
import { FieldSetFormComponent } from './field-set-form.component';
import { RepositoryFormComponent } from './repository-form.component';
import { FieldRulesFormComponent } from './field-rules-form.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    MetalayersRoutingModule
  ],
  declarations: [
    MetalayersComponent,
    MetalayerFormComponent,
    NewMetalayerComponent,
    EditMetalayerComponent,
    MetalayersListComponent,
    FieldResourcesFormComponent,
    FieldSetFormComponent,
    FieldRulesFormComponent,
    RepositoryFormComponent,
  ],
  providers: [
    MetalayersService,
    MapServiceService
  ]
})
export class MetalayersModule {
}
