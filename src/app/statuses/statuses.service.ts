import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RawStatus, Status } from './status';
import { RestClientService } from '../core';
import { SettingsService } from '../core';

@Injectable()
export class StatusesService extends RestClientService {

  private apiPath: string;

  constructor(
    private http: Http,
    private settings: SettingsService
  ) {
    super();
    this.apiPath = this.settings.getApiPath();
  }

  getStatuses(companyId: string, areaTypeId: number): Observable<Status[]> {
    return this.http
      .get(this.collectionPath(companyId, areaTypeId), this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawStatus[]>(response);
        return data.map(this.unmarshalStatus);
      })
      .catch(this.handleError);
  }

  getStatus(companyId: string,  areaTypeId: number, id: number): Observable<Status> {
    return this.http
      .get(this.elementPath(companyId, areaTypeId, id), this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawStatus>(response);
        return this.unmarshalStatus(data);
      })
      .catch(this.handleError);
  }

  createStatus(companyId: string, areaTypeId: number, status: Status): Observable<Status> {
    const body = JSON.stringify(status);

    return this.http
      .post(this.collectionPath(companyId, areaTypeId), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawStatus>(response);
        return this.unmarshalStatus(data);
      })
      .catch(this.handleError);
  }

  updateStatus(companyId: string, areaTypeId: number, status: Status): Observable<Status> {
    const body = JSON.stringify(this.marshalStatus(status));

    return this.http
      .put(this.elementPath(companyId, areaTypeId, status.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawStatus>(response);
        return this.unmarshalStatus(data);
      })
      .catch(this.handleError);
  }

  deleteStatus(companyId: string, areaTypeId: number, id: number): Observable<boolean> {
    return this.http
      .delete(this.elementPath(companyId, areaTypeId, id), this.buildRequestOptions())
      .map((response: Response) => {
        return true;
      })
      .catch(this.handleError);
  }

  private marshalStatus(status: Status): RawStatus {
    let icon = '';

    if (status.icon) {
      icon = JSON.stringify(status.icon);
    }

    return {
      id: status.id,
      name: status.name,
      icon: icon
    };
  }

  private unmarshalStatus(data: RawStatus): Status {
    const status: Status = {
      id: data.id,
      name: data.name
    };

    if (data.icon) {
      status.icon = JSON.parse(data.icon);
    }

    return status;
  }

  private collectionPath(companyId: string, areaTypeId: number): string {
    return `${this.apiPath}/companies/${companyId}/area_types/${areaTypeId}/area_statuses`;
  }

  private elementPath(companyId: string, areaTypeId: number, id: number): string {
    return `${this.collectionPath(companyId, areaTypeId)}/${id}`;
  }

}
