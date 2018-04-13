import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';
import { FileDescriptor, FileManagerConfig } from '../models';
import { RestClientService } from './rest-client.service';
import { SettingsService } from './settings.service';

@Injectable()
export class FileManagerService extends RestClientService {

  private user: any;
  private path: string;

  constructor(
    private http: Http,
    private settings: SettingsService,
    private authentication: AuthenticationService
  ) {
    super();
    this.path = this.settings.getFileManagerPath();
    this.user = this.authentication.getCurrentUser();
  }

  describeFiles(config: FileManagerConfig): Observable<FileDescriptor[]> {
    const url = `${this.path}/describe`;

    return this.http
      .get(url, this.buildRequestOptions(config))
      .map((response: Response) => {
        const files = this.extract<any[]>(response);
        return files.map((file: any) => this.unmarshalFile(file));
      })
      .catch(this.handleError);
  }

  uploadFile(file: File, config: FileManagerConfig): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = `${this.path}/file`;

      $.ajax(url, {
        type: 'post',
        data: this.buildFormData(file, config),
        cache: false,
        contentType: false,
        processData: false,
        headers: {
          'Accept': 'application/json'
        }
      }).then((response: any) => {
        resolve(<any>{
          id: response.id,
          url: `${this.path}/file/${response.id}`
        });
      }, (error: any) => {
        reject(error);
      });
    });
  }

  deleteFile(fileId: number, queryParams: any = {}): Observable<boolean> {
    const url = `${this.path}/file`;
    queryParams.id = fileId;
    queryParams.user = this.user.id;

    return this.http
      .delete(url, this.buildRequestOptions(queryParams))
      .map((response: Response) => {
        return true;
      })
      .catch(this.handleError);
  }

  private unmarshalFile(file: any): FileDescriptor {
    return <FileDescriptor>{
      id: file.id,
      name: file.filename,
      url: `${this.path}/file/${file.id}`
    };
  }

  private buildFormData(file: File, config: FileManagerConfig) {
    const formData = new FormData();
    formData.append('path',   config.path   );
    formData.append('group',  config.group  );
    formData.append('categ',  config.categ  );
    formData.append('entity', config.entity );
    formData.append('user',   config.user   );
    formData.append('file',   file          );
    return formData;
  }

}
