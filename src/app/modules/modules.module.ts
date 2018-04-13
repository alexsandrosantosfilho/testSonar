import { NgModule } from '@angular/core';

import { ModulesComponent } from './modules.component';
import { ModuleFormComponent } from './module-form.component';
import { InspectionModuleFormComponent } from './inspection-module-form.component';
import { TypeFormComponent } from './type-form.component';
import { ModulesListComponent } from './modules-list.component';
import { ModulesRoutingModule } from './modules-routing.module';
import { EditModuleComponent } from './edit-module.component';
import { ModulesService } from './modules.service';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    ModulesRoutingModule
  ],
  declarations: [
    ModulesComponent,
    ModulesListComponent,
    ModuleFormComponent,
    InspectionModuleFormComponent,
    TypeFormComponent,
    EditModuleComponent
  ],
  providers: [
    ModulesService,
  ]
})
export class ModulesModule {
}
