import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationGuardService } from '../core';
import { MetalayersComponent } from './metalayers.component';
import { EditMetalayerComponent } from './edit-metalayer.component';
import { NewMetalayerComponent } from './new-metalayer.component';
import { MetalayersListComponent} from './metalayers-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MetalayersComponent,
        canActivate: [ AuthenticationGuardService ],
        children: [
          { path: 'new',      component: NewMetalayerComponent   },
          { path: ':id/edit', component: EditMetalayerComponent  },
          { path: '',         component: MetalayersListComponent }
        ]
      }
    ])
  ],
  exports: [ RouterModule ]
})
export class MetalayersRoutingModule {
}
