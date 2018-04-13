import * as _ from 'lodash';

import {Injectable} from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class SettingsService {

  private settings: any;

  constructor() {
    this.settings = environment || {};
  }

  all() {
    return this.settings;
  }

  getAppVersion(): string {
    return this.get('version', '');
  }

  get(path: string, defaultValue?: any) {
    return _.get(this.all(), path, defaultValue);
  }

  getApiPath(): string {
    return `${this.get('services.sgt2.path', '')}`;
  }

  getAuthPath(): string {
    return `${this.get('services.auth.path', '')}`;
  }

  getFileManagerPath() {
    return this.get('services.filemanager.path', '');
  }

}
