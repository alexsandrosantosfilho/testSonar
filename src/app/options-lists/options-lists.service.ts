import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { OptionsList } from './options-list';
import { RestClientService } from '../core';
import { SettingsService } from '../core';

@Injectable()
export class OptionsListsService extends RestClientService {

  private apiPath: string;

  constructor(
    private http: Http,
    private settings: SettingsService
  ) {
    super();
    this.apiPath = this.settings.getApiPath();
  }

  getOptionsLists(companyId: string): Observable<OptionsList[]> {
    return this.http
      .get(this.collectionPath(companyId), this.buildRequestOptions())
      .map((response: Response) => {
        const optionsLists = this.extract<OptionsList[]>(response);
        return optionsLists.map((optionsList: OptionsList) => {
          return this.unmarshalOptionsList(optionsList);
        });
      })
      .catch(this.handleError);
  }

  getOptionsList(companyId: string, id: number): Observable<OptionsList> {
    return this.http
      .get(this.elementPath(companyId, id), this.buildRequestOptions())
      .map((response: Response) => {
        const optionsList = this.extract<any>(response);
        return this.unmarshalOptionsList(optionsList);
      })
      .catch(this.handleError);
  }

  createOptionsList(companyId: string, optionsList: OptionsList): Observable<OptionsList> {
    const body = JSON.stringify(this.marshalOptionsList(optionsList, companyId));

    return this.http
      .post(this.collectionPath(companyId), body, this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<OptionsList>(response);
      })
      .catch(this.handleError);
  }

  updateOptionsList(companyId: string, optionsList: OptionsList): Observable<OptionsList> {
    const body = JSON.stringify(this.marshalOptionsList(optionsList, companyId));

    return this.http
      .put(this.elementPath(companyId, optionsList.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        return this.extract<OptionsList>(response);
      })
      .catch(this.handleError);
  }

  deleteOptionsList(companyId: string, id: number): Observable<boolean> {
    return this.http
      .delete(this.elementPath(companyId, id), this.buildRequestOptions())
      .map((response: Response) => {
        return true;
      })
      .catch(this.handleError);
  }

  private marshalOptionsList(optionsList: OptionsList, companyId: string): any {
    const options = JSON.stringify(optionsList.options);

    return {
      name: optionsList.name,
      empresa_id: companyId,
      options: options
    };
  }

  private unmarshalOptionsList(optionsList: any): OptionsList {
    const options = JSON.parse(optionsList.options);

    return <OptionsList>{
      id: optionsList.id,
      name: optionsList.name,
      options: options
    };
  }

  private collectionPath(companyId: string): string {
    return `${this.apiPath}/companies/${companyId}/options_lists`;
  }

  private elementPath(companyId: string, id: number): string {
    return `${this.collectionPath(companyId)}/${id}`;
  }

}
