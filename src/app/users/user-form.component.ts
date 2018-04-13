import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { NgForm } from '@angular/forms';

import { User } from './user';
import { UsersService } from './users.service';

@Component({
  selector: 'sgt2-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnChanges {

  @Output() save: EventEmitter<User> = new EventEmitter<User>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  @Input() companyId: string;
  @Input() user: User;

  data: User = <User>{};
  resetPassword = false;
  editing = false;
  passwordLengthValid = true;
  validated = false;
  submiting = false;
  loginExist = false;
  emailExist = false;

  validateEmail = true;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
    private usersService: UsersService
  ) {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes) {
      if (changes['user'] && this.user) {
        this.data = this.user;
        this.editing = true;
      }
    }
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      this.submiting = true;

      if (this.user) {
        this.update();
      } else {
        this.create();
      }
    }
  }

  onCancel() {
    this.cancel.emit(null);
  }

  onEmailExist() {
    this.emailExist = false
  }

  onLoginExist() {
    this.loginExist = false
  }

  private create() {
    this.passwordLengthValid = this.data.password && this.data.password.length >= 6;

    
    if (this.passwordLengthValid) {
      this.data.root = false;
      this.data.domain = this.companyId;

      this.usersService
        .createUser(this.data)
        .subscribe((user: User) => {
          this.announceSave(user);
        }, (error: any) => {
          if (error.status === 422) {
            if (error._body.includes('Login já existe!')) {
              this.loginExist = true;
            } else {
              this.loginExist = false;
            }

            if (error._body.includes('E-mail já existe')) {
              this.emailExist = true;
            } else {
              this.emailExist = false;
            }
          }
          // TODO: handle error
          this.submiting = false;
        });
    } else {
      this.validated = false;
      this.submiting = false;
    }
  }

  private update() {
    if (this.data.password) {
      this.passwordLengthValid = this.data.password.length >= 6;

      if (!this.passwordLengthValid) {
        this.submiting = false;
        return;
      }
    }

    this.usersService
      .updateUser(this.data)
      .subscribe((user: User) => {
        this.announceSave(user);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private announceSave(user: User) {
    this.validated = false;
    this.submiting = false;
    this.loginExist = false;
    this.emailExist = false;
    this.save.emit(user);
  }

}
