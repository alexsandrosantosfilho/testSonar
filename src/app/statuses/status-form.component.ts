import * as _ from 'lodash';

import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef, Renderer
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { FileManagerConfig } from '../core/models';
import { FileManagerService } from '../core/services';
import { Status } from './status';
import { StatusesService } from './statuses.service';

@Component({
  selector: 'sgt2-status-form',
  templateUrl: './status-form.component.html',
  styleUrls: [ './status-form.component.scss' ]
})
export class StatusFormComponent implements OnChanges {

  @Output() save: EventEmitter<Status> = new EventEmitter<Status>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  @Input() companyId: string;
  @Input() areaTypeId: number;
  @Input() status: Status;

  data: any = {};
  iconUrl = '';
  image: File;
  validated = false;
  imageValid = false;
  allowedExtensions: string[] = [ 'jpeg', 'jpg', 'png' ];
  imageValidationMessage: string;
  editing = false;
  submiting = false;
  submitingImg = false;

  @ViewChild('fileInput')
  private fileInput: ElementRef;

  constructor(
    private fileManagerService: FileManagerService,
    private renderer: Renderer,
    private statusesService: StatusesService
  ) {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes && changes['status'] && this.status) {
      this.data = this.status;
      this.iconUrl = this.status.icon && this.status.icon.url;
      this.editing = true;
    }
  }

  onSubmit(form: NgForm) {
    this.validated = true;
    if (form.valid) {
      this.submiting = true;
     
      if (this.editing) {
        this.update();
      } else {
        this.create();
      }
    } 
  }

  onCancel() {
    this.cancel.emit(null);
  }

  browseFile() {
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'click', []);
  }

  onImageChange(event: any) {
    this.submitingImg = true;
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];

      if (file) {
        this.image = file;
        this.validateImage();

        if (this.imageValid) {
          this.uploadIcon(this.status.id, this.image);
        }
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  removeIcon() {
    this.fileManagerService
      .deleteFile(this.data.icon.id)
      .subscribe(() => {
        this.data.icon = undefined;
        this.iconUrl = '';
        this.update();
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
      });
  }

  private create() {
    this.statusesService
      .createStatus(this.companyId, this.areaTypeId, this.data)
      .subscribe((status: Status) => {
        this.announceSave(status);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private update() {
    this.statusesService
      .updateStatus(this.companyId, this.areaTypeId, this.data)
      .subscribe((status: Status) => {
        this.announceSave(status);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private announceSave(status: Status) {
    this.validated = false;
    this.submiting = false;
    this.save.emit(status);
  }

  private validateImage() {
    this.imageValid = true;
    const fileExtension: string = this.image.name.split('.').pop() || '';

    if (!_.includes(this.allowedExtensions, fileExtension)) {
      this.imageValidationMessage = `A extensão de arquivo "${fileExtension}" não é permitida. As extensões permitidas são: ${this.allowedExtensions.join(', ')}.`;
      this.imageValid = false;
      this.image = undefined;
    }
  }

  private uploadIcon(statusId: number, file: File) {
    const config: FileManagerConfig = {
      path: `companies/${this.companyId}/area-types/${this.areaTypeId}`,
      group: 'statuses',
      categ: 'icons',
      entity: `${statusId}`
    };

    this.fileManagerService
      .uploadFile(file, config)
      .then((icon: any) => {
        const img = new Image();

        img.onload = () => {
          this.iconUrl = icon.url;
          this.data.icon = _.assign(icon, {
            width: img.width,
            height: img.height
          });
          this.submitingImg = false;
          this.update();
        };
        img.src = icon.url;
      }).catch((error: any) => {
        // TODO: handle error
        this.submitingImg = false;
      });
  }

}
