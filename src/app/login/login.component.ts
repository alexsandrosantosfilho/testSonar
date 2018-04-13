import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthenticationService } from '../core';

@Component({
  selector: 'sgt2-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {

  message: string;
  data: any = {};
  errorMessage = false;
  validateForm = false;
  unauthorizedUser = false;  

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router
  ) {
  }

  login(form: NgForm) {
    if (form.valid) {
      this.toggleForm();

      this.authenticationService
        .login(this.data.login, this.data.password)
        .subscribe((data: any) => {
          if (this.authenticationService.isLoggedIn) {
            if (data.user.domain === 'visaogeo') {
              const redirect = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/';
              this.router.navigate([ redirect ]);
            } else {
              this.unauthorizedUser = true;
            }
          }
        }, (error: any) => {
          // TODO: handle error
          console.warn(error);
          this.errorMessage = true;
        });
    } else {
      this.validateForm = true;
      this.errorMessage = false;
    }
  }

  toggleForm() {
    this.errorMessage = false;
    this.validateForm = false;
    this.unauthorizedUser = false;
  }

}
