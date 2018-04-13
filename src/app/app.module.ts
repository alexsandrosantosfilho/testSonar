import './rxjs-extensions';
import * as _ from 'lodash';
import * as $ from 'jquery';
import 'bootstrap';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { createStore, combineReducers } from 'redux';

/* App Root */
import { AppComponent } from './app.component';
import { CoreModule } from './core';

/* Feature modules */
import { CompaniesModule } from './companies';
import { LoginModule } from './login';
import { UsersModule } from './users';
import { ModulesModule } from './modules';
import { AreaTypesModule } from './area-types';
import { OptionsListsModule } from './options-lists';
import { MetalayersModule } from './metalayers';
import { StatusesModule } from './statuses';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

/* Redux */
import { NgReduxModule, NgRedux } from 'ng2-redux';
import { companiesReducers } from './companies/redux';

import { CompaniesService } from './companies/companies.service';
import { Company } from './companies/company';
import { ContextService } from './core';

const reducers = combineReducers({
  companies: companiesReducers
});

const appStore = createStore(reducers);

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    CompaniesModule,
    UsersModule,
    AreaTypesModule,
    OptionsListsModule,
    ModulesModule,
    MetalayersModule,
    CoreModule,
    StatusesModule,
    NgReduxModule.forRoot(),
    LoginModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})

export class AppModule {

  constructor(
    private companiesService: CompaniesService,
    private contextService: ContextService,
    ngRedux: NgRedux<any>
  ) {
    ngRedux.provideStore(appStore);
    this.contextService.init(ngRedux);
  }

}
