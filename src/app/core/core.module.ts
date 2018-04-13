import { Injectable, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserXhr, HttpModule } from '@angular/http';

@Injectable()
export class CorsBrowserXhr extends BrowserXhr {

  build(): any {
    const xhr = super.build();
    xhr.withCredentials = true;
    return <any>(xhr);
  }

}

import {
  AuthenticationGuardService,
  AuthenticationService,
  FileManagerService,
  RestClientService,
  SettingsService,
  ContextService
} from './services';

@NgModule({
  imports: [
    HttpModule
  ],
  declarations: [],
  exports: [],
  providers: [
    { provide: BrowserXhr, useClass: CorsBrowserXhr },
    AuthenticationGuardService,
    AuthenticationService,
    FileManagerService,
    RestClientService,
    SettingsService,
    ContextService
  ]
})
export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
