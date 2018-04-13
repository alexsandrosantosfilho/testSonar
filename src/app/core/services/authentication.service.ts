import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RestClientService } from './rest-client.service';
import { SettingsService } from './settings.service';

@Injectable()
export class AuthenticationService extends RestClientService {

  isLoggedIn = false;
  redirectUrl: string;

  private authPath: string;
  private context: any;

  constructor(
    private http: Http,
    private settingsService: SettingsService
  ) {
    super();
    this.authPath = this.settingsService.getAuthPath();
    this.initContext();
  }

  login(login: string, password: string): Observable<boolean> {
    // TODO: improve backend to receive json
    const body = JSON.stringify({ login: login, password: password });
    const url = `${this.authPath}/users/login`;

    return this.http
      .post(url, body, this.buildRequestOptions())
      .map((response: Response) => {
        let user = this.extract<any[]>(response);
        this.saveContext({
          isLoggedIn: true,
          user: user
        });

        return { user: user };
      })
      .catch(this.handleError);
  }

  logout(): Observable<boolean> {
    const url = `${this.authPath}/users/logout`;

    return this.http
      .delete(url, this.buildRequestOptions())
      .map((response: Response) => {
        this.isLoggedIn = false;
        this.saveContext({ isLoggedIn: false });
        return true;
      })
      .catch(this.handleError);
  }

  urlEncode(data: Object): string {
    const urlSearchParams = new URLSearchParams();

    for (const key in data) {
      urlSearchParams.append(key, data[key]);
    }

    return urlSearchParams.toString();
  }

  getCurrentUser() {
    return this.context.user;
  }

  private initContext() {
    const serialized = sessionStorage.getItem('br.com.visaogeo');
    this.context = serialized ? JSON.parse(serialized) : {};
    this.isLoggedIn = this.context.isLoggedIn || false;
  }

  private saveContext(context: any) {
    this.context = context;
    this.isLoggedIn = context.isLoggedIn;
    let serialized = JSON.stringify(context);
    sessionStorage.setItem('br.com.visaogeo', serialized);
  }

}
