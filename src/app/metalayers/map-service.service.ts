import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Field } from './field';
import { RestClientService } from '../core';

@Injectable()
export class MapServiceService extends RestClientService {

  constructor(
    private http: Http
  ) {
    super();
  }

  getMapServiceData(serviceUrl: string, serviceType: string): Observable<any[]> {
    return this.http
        .get(serviceUrl, this.buildRequestOptions())
        .map((response: Response) => {
            const data = this.extract<any>(response);
            return this.extractFields(data, serviceType);
        })
        .catch(this.handleError);
    }

  buildRequestOptions(queryParams: any = {}): RequestOptions {
    const headers: Headers = new Headers({
      'Accept': 'application/json'
    });

    return new RequestOptions({ headers: headers });
  }

  private extractFields(data: any, serviceType: string) {
    if (serviceType === 'geo') {
      let layers: any[] = [];

      if (data.featureTypes) {
        layers = data.featureTypes.map((layer: any) => {
          const fields: Field[] = layer.properties.map((property: any) => {
            const field: Field = new Field();
            field.name = property.name;
            field.nullable = property.nillable;
            field.type = property.localType;

            return field;
          });

          return {
            name: layer.typeName,
            fields: _.sortBy(fields, ['name'])
          };
        });
      }

      return layers;

    } else if (serviceType === 'arcgis') {
      let fields: Field[] = [];

      if (data.fields) {
        fields = data.fields.map((field: any) => {
          return _.assign(new Field(), field);
        });
      }

      return _.sortBy(fields, ['name']);
    }
  }
}
