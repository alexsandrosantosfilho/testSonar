import { NgModule } from '@angular/core';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    LoginRoutingModule,
    SharedModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule {
}
