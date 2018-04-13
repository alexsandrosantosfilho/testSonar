import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormFieldMetadata } from '../shared/components/dynamic-form/form-field';
import { DynamicFormConfigComponent } from '../shared/components/dynamic-form/dynamic-form-config.component';
import { FolderFormComponent } from './folder-form.component';
import { AreaType } from './area-type';
import { AreaTypesService } from './area-types.service';

interface Folder {
  id: string;
  name: string;
  children: Folder[];
  opened?: boolean;
}

@Component({
  selector: 'sgt2-area-type-form',
  templateUrl: './area-type-form.component.html',
  styleUrls: [ './area-type-form.component.scss' ]
})
export class AreaTypeFormComponent implements OnChanges {

  @Output() save: EventEmitter<AreaType> = new EventEmitter<AreaType>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  @Input() companyId: string;
  @Input() areaType: AreaType;

  addingParent: Folder;
  editingFolder: Folder;
  data: any = {};
  validated = false;
  submiting = false;
  fields: FormFieldMetadata[] = [];
  folders: Folder[] = [];
  externalFields: FormFieldMetadata[] = [
    {
      name: 'status',
      label: 'Status'
    }
  ];

  @ViewChild('folderForm')
  private folderForm: FolderFormComponent;

  constructor(
    private areaTypesService: AreaTypesService
  ) {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes && changes['areaType'] && this.areaType) {
      this.data = this.areaType;
      this.fields = _.get(this.areaType, 'settings.form.fields', []);
      this.folders = _.get(this.areaType, 'settings.attachments.folders', []);
    }
  }

  onSubmit(form: NgForm) {
    _.set(this.data, 'settings.form.fields', this.fields);
    this.folders = this.folders.map((folder: any) => {
      return this.marshalFolder(folder);
    });
    _.set(this.data, 'settings.attachments.folders', this.folders);
    this.validated = true;

    if (form.valid) {
      this.submiting = true;

      if (this.areaType) {
        this.update();
      } else {
        this.create();
      }
    }
  }

  onCancel() {
    this.cancel.emit(null);
  }

  onFieldsChange(fields: FormFieldMetadata[]) {
    this.fields = fields;
  }

  addFolder(parent?: Folder) {
    this.addingParent = parent;
    this.folderForm.open();
  }

  deleteFolder(folder: Folder, parent: Folder) {
    const folders = parent ? parent.children : this.folders;
    const index: number = folders.indexOf(folder);

    if (index >= 0) {
      folders.splice(index, 1);
    }
  }

  onSaveFolder(folder: Folder) {
    folder.children = [];
    folder.opened = false;

    if (this.addingParent) {
      this.addingParent.children.push(folder);
      this.addingParent.opened = true;
    } else {
      this.folders.push(folder);
    }
  }

  editFolder(folder) {
    this.editingFolder = folder;
    this.folderForm.open(folder);
  }

  onUpdateFolder(folder) {
    _.assign(this.editingFolder, folder);
  }

  private marshalFolder(folder: Folder) {
    if (folder.children) {
      folder.children = folder.children.map((children: any) => {
        return this.marshalFolder(children);
      });
    }

    return {
      id: folder.id,
      name: folder.name,
      children: folder.children
    };
  }

  private create() {
    this.areaTypesService
      .createAreaType(this.companyId, this.data)
      .subscribe((areaType: AreaType) => {
        this.announceSave(areaType);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private update() {
    this.areaTypesService
      .updateAreaType(this.companyId, this.data)
      .subscribe((areaType: AreaType) => {
        this.announceSave(areaType);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private announceSave(areaType: AreaType) {
    this.validated = false;
    this.submiting = false;
    this.save.emit(areaType);
  }

}
