import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DynamicFormConfigComponent, FieldFormComponent, FieldOptionsFormComponent, FieldRulesFormComponent } from './components/dynamic-form';
import { HeaderComponent, StrongConfirmationModalComponent, AboutModalComponent } from './components';
import { TooltipDirective, ReplaceDirective } from './directives';

@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    AboutModalComponent,
    DynamicFormConfigComponent,
    FieldFormComponent,
    FieldOptionsFormComponent,
    FieldRulesFormComponent,
    HeaderComponent,
    ReplaceDirective,
    StrongConfirmationModalComponent,
    TooltipDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    TooltipDirective,
    ReplaceDirective,
    FieldOptionsFormComponent,
    DynamicFormConfigComponent,
    StrongConfirmationModalComponent
  ],
  providers: [
    /**
     * Do not provide any service from ShareModule.
     * Common services must be defined and provided by CoreModule.
     **/
  ]
})
export class SharedModule {
}
