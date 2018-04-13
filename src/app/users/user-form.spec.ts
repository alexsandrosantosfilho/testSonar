import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { NgForm } from '@angular/forms';

import { AppModule } from '../../app';

import { UserFormComponent } from './user-form.component';
import { UsersModule } from './users.module';
import { User } from './user';

describe('Component: UserForm', () => {

  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let submitEl: DebugElement;
  let form: any = {
    valid: true
  }
  let user: User = {
    id: "1613",
    name: "Kristian Santos",
    email: "ksantos@visaogeo.com.br",
    domain: "devvg",
    login: "kristian",
    root: false
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [FormsModule, AppModule, HttpModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });

    fixture = TestBed.createComponent(UserFormComponent);
  
    component = fixture.componentInstance;

    submitEl = fixture.debugElement.query(By.css('button[type=submit]'));
  }));

  it('password length validation should be false when create', () => {
    component.data.password = '12345';
    fixture.detectChanges();

    component.onSubmit(form);
  
    expect(component.passwordLengthValid).toBe(false);
  });


  it('password length validation should be true when create', () => {
    component.data.password = '123456';
    fixture.detectChanges();

    component.onSubmit(form);
  
    expect(component.passwordLengthValid).toBe(true);
  });

  it('password length validation should be false when update', () => {
    component.data.password = '12345';
    fixture.detectChanges();
    component.user = user;

    component.onSubmit(form);
  
    expect(component.passwordLengthValid).toBe(false);
  });


  it('password length validation should be true when update', () => {
    component.data.password = '123456';
    fixture.detectChanges();
    component.user = user;

    component.onSubmit(form);
  
    expect(component.passwordLengthValid).toBe(true);
  });
});
