import * as _ from 'lodash';
import * as vkbeautify from 'vkbeautify';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Repository } from './repository';
import { FieldSet } from './field-set';
import { Field } from './field';
import { Metalayer, RawMetalayer } from './metalayer';
import { RestClientService } from '../core';
import { SettingsService } from '../core';

@Injectable()
export class MetalayersService extends RestClientService {

  private apiPath: string;

  constructor(
    private http: Http,
    private settings: SettingsService
  ) {
    super();
    this.apiPath = this.settings.getApiPath();
  }

  getMetalayers(companyId: string, areaTypeId: number): Observable<Metalayer[]> {
    return this.http
      .get(this.collectionPath(companyId, areaTypeId), this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawMetalayer[]>(response);
        return this.unmarshalMetalayers(data);
      })
      .catch(this.handleError);
  }

  getMetalayer(companyId: string, areaTypeId: number, id: number): Observable<Metalayer> {
    return this.http
      .get(this.elementPath(companyId, areaTypeId, id), this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawMetalayer>(response);
        return this.unmarshalMetalayer(data);
      })
      .catch(this.handleError);
  }

  createMetalayerXml(companyId: string, areaTypeId: number, metalayer: Metalayer): Observable<Metalayer> {
    const body = JSON.stringify(this.marshalMetalayer(metalayer));

    return this.http
      .post(this.collectionPath(companyId, areaTypeId), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawMetalayer>(response);
        return this.unmarshalMetalayer(data);
      })
      .catch(this.handleError);
  }

  updateMetalayerXml(companyId: string, areaTypeId: number, metalayer: Metalayer): Observable<Metalayer> {
    const body = JSON.stringify(this.marshalMetalayer(metalayer));

    return this.http
      .put(this.elementPath(companyId, areaTypeId, metalayer.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawMetalayer>(response);
        return this.unmarshalMetalayer(data);
      })
      .catch(this.handleError);
  }

  deleteMetalayer(companyId: string, areaTypeId: number, id: number): Observable<boolean> {
    return this.http
      .delete(this.elementPath(companyId, areaTypeId, id), this.buildRequestOptions())
      .map((response: Response) => {
        return true;
      })
      .catch(this.handleError);
  }

  buildXml(metalayer: Metalayer) {
    const settings = this.buildSettings(metalayer);
    const x2js = new X2JS();
    const xml = x2js.js2xml({ metacamada: settings });
    return vkbeautify.xml(xml);
  }

  private marshalMetalayer(metalayer: Metalayer): RawMetalayer {
    return {
      id: metalayer.id,
      dado: vkbeautify.xmlmin(metalayer.settings)
    };
  }

  private unmarshalMetalayers(metalayers: RawMetalayer[]) {
    return metalayers.map((metalayer: RawMetalayer) => {
      return this.unmarshalMetalayer(metalayer);
    });
  }

  private unmarshalMetalayer(metalayer: RawMetalayer): Metalayer {
    // let xmlObject: any;
    let settings: any;

    try {
      const x2js = new X2JS();
      settings = x2js.xml2js(metalayer.dado).metacamada;
      // xmlObject = $($.parseXML(metalayer.settings));
    } catch (ex) {
      console.warn(ex);

      return <Metalayer>{
        id: metalayer.id
      };
    }

    // let fieldSets = this.unmarshalFieldSets(settings.display_feature.fields);
    // let fields = _.reduce(fieldSets, (data: Field[], fieldSet: FieldSet) => {
    //   return data.concat(fieldSet.fields);
    // }, []);

    // let fieldId = _.find(settings.display_feature.fields, { name: settings.fid });
    // let fid = this.unmarshalFid(fieldId);
    // fields.push(fid);

    return <Metalayer>{
      id: metalayer.id,
      metalayerId: settings.id,
      name: settings.display_name,
      category: settings.categ,
      order: +settings.order,
      enabled: settings.enabled === 'true',
      visible: settings.visible === 'true',
      // fieldSets: fieldSets,
      // fields: _.uniqBy(fields, 'name'),
      // fid: fid,
      radius: +settings.raiobusca,
      opacity: settings.opacity,
      // repositories: this.unmarshalRepositories(settings.display_feature.fields),
      settings: vkbeautify.xml(metalayer.dado)
    };
  }

  private unmarshalFid(field: any) {
    return <Field>{
      name: field.name,
      alias: field.alias,
      type: field.type,
      editable: field.editable,
      visible: true,
      nullable: field.nullable
    };
  }

  private unmarshalFieldSets(fieldSets: any[]): FieldSet[] {
    fieldSets = fieldSets.filter((field: any) => {
      return _.includes(['geral'], field.type);
    });

    return fieldSets.map((field: any) => {
      const fields = _.isArray(field.display_feature.fields) ? field.display_feature.fields : [ field.display_feature.fields ];

      return <FieldSet>{
        name: field.name,
        alias: field.alias,
        type: field.type,
        fields: this.unmarshalFields(fields)
      };
    });
  }

  private unmarshalFields(fields: any[]): Field[] {
    fields = fields.filter((field: any) => {
      return !_.includes(['detail'], field.type);
    });

    return fields.map((field: any) => {
      const rules = _.isArray(field.rules) ? field.rules : [ field.rules ];

      return <Field>{
        name: field.name,
        alias: field.alias,
        type: field.type,
        editable: field.editable,
        visible: true,
        nullable: field.nullable,
        precision: +field.precision,
        resources: this.unmarshalResources(field),
        rules: rules
      };
    });
  }

   private unmarshalResources(field) {
     if (field.type === 'choose') {
       const resources = JSON.parse(field.resource);
       const options = [];

       _.forEach(resources, function(label, value) {
         options.push({value, label});
       });

       return {
         options: options
       };
     } else {
       return field.resource;
     }
   }

  private unmarshalRepositories(fields: any[]): Repository[] {
    fields = fields.filter((field: any) => {
      return _.includes(['godocs', 'filemanager'], field.type);
    });

    return fields.map((field: any) => {
      return <Repository>{
        name: field.name,
        alias: field.alias,
        type: field.type,
        source: field.resource
      };
    });
  }

  private buildSettings(metalayer: Metalayer) {
    const repositories = metalayer.repositories.map((repository: Repository) => {
      return {
        type: repository.type,
        name: repository.name,
        alias: repository.alias,
        resource: repository.source,
      };
    });

    const fieldSets = metalayer.fieldSets.map((fieldSet: FieldSet) => {
      const fields = fieldSet.fields.map((field: Field) => {
        return {
          name: field.name,
          alias: field.alias,
          type: field.type,
          editable: field.editable,
          nullable: field.nullable,
          resources: JSON.stringify(field.resources || {}),
          precision: field.precision,
          rules: field.rules
        };
      });

      const showFields = fields.map((field: Field) => {
        return field.name;
      });

      return {
        type: fieldSet.type,
        name: fieldSet.name,
        alias: fieldSet.alias,
        display_feature: {
          showfields: showFields,
          fields: fields
        }
      };
    });

    const repositoryNames = metalayer.repositories.map((repository: Repository) => {
      return repository.name;
    });

    const fieldSetsNames = metalayer.fieldSets.map((fieldSet: FieldSet) => {
      return fieldSet.name;
    });

    return {
      id: metalayer.id,
      display_name: metalayer.name,
      categ: metalayer.category,
      enabled: metalayer.enabled,
      order: `${metalayer.order}`,
      raiobusca: `${metalayer.radius}`,
      visible: metalayer.visible,
      opacity: metalayer.opacity,
      fid: metalayer.fid.name,
      display_feature: {
        showfields: [
          ...fieldSetsNames,
          ...repositoryNames
        ],
        fields: [
          metalayer.fid,
          ...fieldSets,
          ...repositories
        ],
      }
    };
  }

  private collectionPath(companyId: string, areaTypeId: number) {
    return `${this.apiPath}/companies/${companyId}/area_types/${areaTypeId}/meta_layers`;
  }

  private elementPath(companyId: string, areaTypeId: number, id: number) {
    return `${this.collectionPath(companyId, areaTypeId)}/${id}`;
  }

}
