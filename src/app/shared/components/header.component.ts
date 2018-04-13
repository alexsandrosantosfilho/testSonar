import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, ContextService } from '../../core';
import { resetCompanies } from '../../companies/redux';

import { AboutModalComponent } from './about-modal.component';

@Component({
  selector: 'sgt2-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @ViewChild('aboutModalComponent')
  private aboutModalComponent: AboutModalComponent;

  constructor(
    private authenticationService: AuthenticationService,
    private contextService: ContextService,
    public router: Router
  ) {
  }

  onAboutClick() {
    this.aboutModalComponent.open();
  }

  onLogoutClick() {
    this.authenticationService
      .logout()
      .subscribe(() => {
        this.router.navigate(['/login']);
        const action = resetCompanies();
        this.contextService.updateContext(action);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
      });
  }

}
