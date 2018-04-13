import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AreaType, RawAreaType } from './area-type';
import { RestClientService } from '../core';
import { SettingsService } from '../core';

@Injectable()
export class AreaTypesService extends RestClientService {

  private apiPath: string;

  constructor(
    private http: Http,
    private settings: SettingsService
  ) {
    super();
    this.apiPath = this.settings.getApiPath();
  }

  getAreaTypes(companyId: string): Observable<AreaType[]> {
    return this.http
      .get(this.collectionPath(companyId), this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawAreaType[]>(response);
        return data.map(this.unmarshalAreaType);
      })
      .catch(this.handleError);
  }

  getAreaType(companyId: string, id: number): Observable<AreaType> {
    return this.http
      .get(this.elementPath(companyId, id), this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawAreaType>(response);
        return this.unmarshalAreaType(data);
      })
      .catch(this.handleError);
  }

  createAreaType(companyId: string, areaType: AreaType): Observable<AreaType> {
    const body = JSON.stringify(this.marshalAreaType(areaType));

    return this.http
      .post(this.collectionPath(companyId), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawAreaType>(response);
        return this.unmarshalAreaType(data);
      })
      .catch(this.handleError);
  }

  updateAreaType(companyId: string, areaType: AreaType): Observable<AreaType> {
    const body = JSON.stringify(this.marshalAreaType(areaType));

    return this.http
      .put(this.elementPath(companyId, areaType.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawAreaType>(response);
        return this.unmarshalAreaType(data);
      })
      .catch(this.handleError);
  }

  deleteAreaType(companyId: string, id: number): Observable<boolean> {
    return this.http
      .delete(this.elementPath(companyId, id), this.buildRequestOptions())
      .map((response: Response) => {
        return true;
      })
      .catch(this.handleError);
  }

  private marshalAreaType(areaType: AreaType): RawAreaType {
    return {
      id: areaType.id,
      tipo: areaType.name,
      settings: JSON.stringify(areaType.settings)
    };
  }

  private unmarshalAreaType(data: RawAreaType): AreaType {
    return {
      id: data.id,
      name: data.tipo,
      settings: JSON.parse(data.settings || '{}')
    };
  }

  private collectionPath(companyId: string): string {
    return `${this.apiPath}/companies/${companyId}/area_types`;
  }

  private elementPath(companyId: string, id: number): string {
    return `${this.collectionPath(companyId)}/${id}`;
  }

}
