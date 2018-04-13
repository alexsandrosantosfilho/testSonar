import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Module, ModuleSettings, RawModule } from './module';
import { RestClientService } from '../core';
import { SettingsService } from '../core';

@Injectable()
export class ModulesService extends RestClientService {

  private apiPath: string;

  constructor(
    private http: Http,
    private settings: SettingsService
  ) {
    super();
    this.apiPath = this.settings.getApiPath();
  }

  getModules(companyId: string): Observable<Module[]> {
    return this.http
      .get(this.collectionPath(companyId), this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawModule[]>(response);

        return data.map((module: RawModule) => {
          return this.unmarshalModule(module);
        });
      })
      .catch(this.handleError);
  }

  getModule(companyId: string, moduleId: string): Observable<Module> {
    return this.http
      .get(this.elementPath(companyId, moduleId), this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawModule>(response);
        return this.unmarshalModule(data);
      })
      .catch(this.handleError);
  }

  updateModule(companyId: string, module: Module): Observable<Module> {
    const body = JSON.stringify(this.marshalModule(module));

    return this.http
      .put(this.elementPath(companyId, module.id), body, this.buildRequestOptions())
      .map((response: Response) => {
        const data = this.extract<RawModule>(response);
        return this.unmarshalModule(data);
      })
      .catch(this.handleError);
  }

  private marshalModule(module: Module): any {
    return {
      name: module.name,
      label: module.label,
      enable: module.enabled,
      settings: JSON.stringify(module.settings)
    };
  }

  private unmarshalModule(data: RawModule): Module {
    const settings = JSON.parse(data.settings || '{}');
    let label: string = (settings || {}).label;

    switch (data.name) {
      case 'fund': label = label || 'Fundiário';     break;
      case 'insp': label = label || 'Inspeção';      break;
      case 'regu': label = label || 'Regulação';     break;
      case 'meio': label = label || 'Meio Ambiente'; break;
    }

    return {
      id: data.name,
      name: data.name,
      label: label,
      enabled: data.enable,
      settings: this.unmarshalSettings(settings)
    };
  }

  private unmarshalSettings(settings: any): ModuleSettings {
    const complaint    = settings.os || settings.complaint || {};
    const survey       = settings.vistoria || settings.survey || {};
    const intervention = settings.intervencao || settings.intervention || {};
    const denunciator  = settings.demandante || settings.denunciator || {};
    complaint.types    = this.unmarshalTypes(complaint);
    survey.types       = this.unmarshalTypes(survey);
    intervention.types = this.unmarshalTypes(intervention);
    denunciator.types  = this.unmarshalTypes(denunciator);

    return {
      complaint: complaint,
      survey: survey,
      intervention: intervention,
      denunciator: denunciator
    };
  }

  private unmarshalTypes(entity: any) {
    if (!entity.types && entity.tipo) {
      entity.types = entity.tipo.map((type: string) => {
        return {
          value: type,
          label: type
        };
      });
    }

    entity.tipo = undefined;
    return entity.types || [];
  }

  private collectionPath(companyId: string): string {
    return `${this.apiPath}/companies/${companyId}/modules`;
  }

  private elementPath(companyId: string, id: string): string {
    return `${this.collectionPath(companyId)}/${id}`;
  }

}
