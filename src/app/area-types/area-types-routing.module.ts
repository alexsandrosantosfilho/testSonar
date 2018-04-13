import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationGuardService } from '../core';
import { AreaTypesComponent } from './area-types.component';
import { EditAreaTypeComponent } from './edit-area-type.component';
import { NewAreaTypeComponent } from './new-area-type.component';
import { AreaTypesListComponent} from './area-types-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AreaTypesComponent,
        canActivate: [ AuthenticationGuardService ],
        children: [
          { path: 'new',      component: NewAreaTypeComponent   },
          { path: ':id/edit', component: EditAreaTypeComponent  },
          { path: ':areaTypeId/metalayers', loadChildren: 'app/metalayers/metalayers.module#MetalayersModule' },
          { path: ':areaTypeId/statuses', loadChildren: 'app/statuses/statuses.module#StatusesModule' },
          { path: '',         component: AreaTypesListComponent }
        ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class AreaTypesRoutingModule {
}
