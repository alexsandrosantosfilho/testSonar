import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user';
import { RestClientService } from '../core';
import { SettingsService } from '../core';

@Injectable()
export class UsersService extends RestClientService {

  private apiPath: string;

  constructor(
    private http: Http,
    private settings: SettingsService
  ) {
    super();
    this.apiPath = this.settings.getAuthPath();
  }

  getUsers(companyId: string): Observable<User[]> {
    const queryParams: any = { domain: companyId };

    return this.http
      .get(this.collectionPath(), this.buildRequestOptions(queryParams))
      .map((response: Response) => {
        let users = this.extract<User[]>(response);
        users = _.filter(users, (user: User) => {
          return !(user.name.includes('(Excluido)'));
        });
        return _.sortBy(users, ['name']);
      })
      .catch(this.handleError);
  }

  getUser(id: string): Observable<User> {
    return this.http
      .get(this.elementPath(id), this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<User>(response);
      })
      .catch(this.handleError);
  }

  getRootUser(companyId: string) {
    const queryParams: any = {
      domain: companyId,
      root: true
    };

    return this.http
      .get(this.collectionPath(), this.buildRequestOptions(queryParams))
      .map((response: Response) => {
        const users = this.extract<User[]>(response);
        return users[0];
      })
      .catch(this.handleError);
  }

  createUser(data: User): Observable<User> {
    const body: any = JSON.stringify(data);

    return this.http
      .post(this.collectionPath(), body, this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<User>(response);
      })
      .catch(this.catchError);
  }

  updateUser(data: User): Observable<User> {
    const body: any = JSON.stringify(this.marshalUser(data));

    return this.http
      .put(this.elementPath(data.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<User>(response);
      })
      .catch(this.handleError);
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http
      .delete(this.elementPath(id), this.buildRequestOptions())
      .map((response: Response) => {
        return true;
      })
      .catch(this.handleError);
  }

  private marshalUser(user: User): any {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      name: user.name,
      password: user.password
    };
  }

  catchError(error: any): ErrorObservable {
    return Observable.throw(error);
  }

  private collectionPath(): string {
    return `${this.apiPath}/users`;
  }

  private elementPath(id: string): string {
    return `${this.collectionPath()}/${id}`;
  }

}
