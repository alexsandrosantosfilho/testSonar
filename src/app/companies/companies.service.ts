import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Company, RawCompany } from './company';
import { ContextService, RestClientService, SettingsService } from '../core';
import { addCompany, initCompanies, removeCompany, updateCompany } from './redux';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class CompaniesService extends RestClientService {

  private companies: Company[] = [];
  private apiPath: string;

  constructor(
    private contextService: ContextService,
    private http: Http,
    private settings: SettingsService
  ) {
    super();
    this.apiPath = this.settings.getApiPath();

    this.contextService.contextChanges$.subscribe((context: any) => {
      if (context) {
        if (context.companies.length) {
          this.companies = context.companies;
        }
      }
    });
  }

  getCompanies(): Observable<Company[]> {
    if (this.companies.length) {
      return Observable.of(this.companies);
    } else {
      return this.http
        .get(this.collectionPath(), this.buildRequestOptions())
        .map((response: Response) => {
          const data = this.extract<RawCompany[]>(response);
          this.companies = data.map(this.unmarshalCompany);
          const action = initCompanies(this.companies);
          this.contextService.updateContext(action);
          return this.companies;
        })
        .catch(this.handleError);
    }
  }

  getCompany(id: string): Observable<Company> {
    if (this.companies.length) {
      const company = _.find(this.companies, { id: id });
      return Observable.of(company);
    } else {
      return new Observable<Company>((observer: Observer<Company>) => {
        this.getCompanies().subscribe((companies: Company[]) => {
          return this.getCompany(id).subscribe((company: Company) => {
            observer.next(company);
            observer.complete();
          });
        });
      });
    }
  }

  createCompany(company: Company): Observable<Company> {
    const body = JSON.stringify(this.marshalCompany(company));

    return this.http
      .post(this.collectionPath(), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawCompany>(response);
        const createdCompany = this.unmarshalCompany(data);
        const action = addCompany(createdCompany);
        this.contextService.updateContext(action);
        return createdCompany;
      })
      .catch(this.catchError);
  }

  updateCompany(company: Company): Observable<Company> {
    const body = JSON.stringify(this.marshalCompany(company));

    return this.http
      .put(this.elementPath(company.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawCompany>(response);
        const updatedCompany = this.unmarshalCompany(data);
        const action = updateCompany(updatedCompany);
        this.contextService.updateContext(action);
        return updatedCompany;
      })
      .catch(this.handleError);
  }

  deleteCompany(company: Company) {
    return this.http
      .delete(this.elementPath(company.id), this.buildRequestOptions())
      .map((response: Response) => {
        const action = removeCompany(company);
        this.contextService.updateContext(action);
        return true;
      })
      .catch(this.handleError);
  }

  private marshalCompany(company: Company): RawCompany {
    let logo = '';
    let reportLogo = '';

    if (company.logo) {
      logo = JSON.stringify(company.logo);
    }

    if (company.reportLogo) {
      reportLogo = JSON.stringify(company.reportLogo)
    }

    return {
      id: company.id,
      nome: company.name,
      logo: logo,
      geoserver: company.geoserver || false, 
      logo_print: reportLogo,
      settings: JSON.stringify(company.settings),
    };
  }

  private unmarshalCompany(data: RawCompany): Company {
    const company = new Company();
    company.id   = data.id;
    company.name = data.nome;
    company.geoserver = data.geoserver;
    company.settings = JSON.parse(data.settings || '{}');

    if (data.logo) {
      company.logo = JSON.parse(data.logo);
    }

    if (data.logo_print) {
      company.reportLogo = JSON.parse(data.logo_print)
    }

    return company;
  }

  private collectionPath(): string {
    return `${this.apiPath}/companies`;
  }

  private elementPath(id: string): string {
    return `${this.collectionPath()}/${id}`;
  }

  catchError(error: any): ErrorObservable {
    return Observable.throw(error);
  }

}
