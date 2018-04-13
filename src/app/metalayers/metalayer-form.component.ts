import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, SimpleChange, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { FieldOptionsFormComponent } from '../shared/components/dynamic-form/field-options-form.component';
import { FormFieldMetadata, FormFieldRule } from '../shared/components/dynamic-form/form-field';
import { RepositoryFormComponent } from './repository-form.component';
import { FieldSetFormComponent } from './field-set-form.component';
import { FieldSet } from './field-set';
import { Field } from './field';
import { Repository } from './repository';
import { Metalayer } from './metalayer';
import { MetalayersService } from './metalayers.service';
import { MapServiceService } from './map-service.service';
import { FieldRulesFormComponent } from './field-rules-form.component';

@Component({
  selector: 'sgt2-metalayer-form',
  templateUrl: './metalayer-form.component.html',
  styleUrls: ['./metalayer-form.component.scss']
})
export class MetalayerFormComponent implements OnChanges, OnDestroy {

  @Output() save: EventEmitter<Metalayer> = new EventEmitter<Metalayer>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  @Input() companyId: string;
  @Input() areaTypeId: number;
  @Input() metalayer: Metalayer;

  @ViewChild('fieldOptionsForm')
  private fieldOptionsForm: FieldOptionsFormComponent;

  @ViewChild('repositoryForm')
  private repositoryForm: RepositoryFormComponent;

  @ViewChild('fieldSetForm')
  private fieldSetForm: FieldSetFormComponent;

  @ViewChild('fieldRulesForm')
  private fieldRulesForm: FieldRulesFormComponent;

  data: any = {};
  configXML = true;
  xmlValid = true;
  validated = false;
  fidValid = false;
  submiting = false;
  mapServiceUrl: string;
  // mapServiceUrl: string = 'http://54.232.177.105:6080/arcgis/rest/services/DEMO/DEMO_UHE_CANTAO/FeatureServer/0?f=pjson';
  // mapServiceUrl: string = 'http://177.70.21.246:8080/servermapvg/wfs?service=wfs&version=2.0.0&request=DescribeFeatureType&outputFormat=application/json';
  fidName: string;
  fields: Field[] = [];
  filteredFields: Field[] = [];
  visibleFields: Field[] = [];
  onlyVisible = false;
  serviceType: string;
  layers: any[] = [];
  layerName: string;
  fieldSets: FieldSet[] = [];
  repositories: Repository[] = [];
  editingField: FormFieldMetadata;
  editingRules: FormFieldRule;
  editingRepository: Repository;
  editingFieldSet: FieldSet;
  dataSources: any[] = [];
  dataSource: any = {};

  constructor(
    private location: Location,
    private metalayersService: MetalayersService,
    private mapService: MapServiceService
  ) {}

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes && changes['metalayer'] && this.metalayer) {
      this.data = this.metalayer;
      // this.repositories = this.metalayer.repositories;
      // this.fieldSets = this.metalayer.fieldSets;
      // this.fields = this.metalayer.fields;
      // this.fidName = this.metalayer.fid.name;
      // this.visibleFields = this.fields;
      // this.filterFields(false);
    }
  }

  ngOnDestroy() {}

  onSubmit(form: NgForm) {
    this.validated = true;

    if (!this.configXML) {
      const fid = _.find(this.fields, { name: this.fidName });
      this.fidValid = !!fid;

      if (form.valid && this.fidValid) {
        const data = _.clone(this.data);
        data.fields = this.fields;
        data.fieldSets = this.fieldSets;
        data.repositories = this.repositories;
        data.fid = _.find(this.fields, { name: this.fidName });
        // this.data.settings = this.metalayersService.buildXml(data);
      }
    } else {
      this.xmlValid = true;
      this.validateXml();

      if (form.valid && this.xmlValid) {
        this.submiting = true;

        if (this.metalayer) {
          this.update();
        } else {
          this.create();
        }
      }
    }
  }

  configsXML(configXML: boolean) {
    this.configXML = configXML;
    this.validated = false;
  }

  updateFid(fidName: string, field: Field) {
    this.fidName = fidName;
    // field.visible = true;
  }

  // FieldSet

  addFieldSet() {
    this.fieldSetForm.open();
  }

  editFieldSet(fieldSet: FieldSet) {
    this.editingFieldSet = fieldSet;
    this.fieldSetForm.open(fieldSet);
  }

  onSaveFieldSet(fieldSet: FieldSet) {
    this.fieldSets.push(fieldSet);
  }

  onUpdateFieldSet(fieldSet: FieldSet) {
    _.assign(this.editingFieldSet, fieldSet);
  }

  onCancelFieldSet() {
    this.editingFieldSet = null;
  }

  removeFieldSet(fieldSet: FieldSet) {
    const index: number = this.fieldSets.indexOf(fieldSet);

    if (index >= 0) {
      this.fieldSets.splice(index, 1);
    }
  }

  // Repository

  onSaveRepository(repository) {
    this.repositories.push(repository);
  }

  onUpdateRepository(repository) {
    _.assign(this.editingRepository, repository);
  }

  onCancelRepository() {
    this.editingRepository = null;
  }

  editRepository(repository: Repository) {
    this.editingRepository = repository;
    this.repositoryForm.open(repository);
  }

  addRepository() {
    this.repositoryForm.open();
  }

  deleteRepository(repository: Repository) {
    const index: number = this.repositories.indexOf(repository);

    if (index >= 0) {
      this.repositories.splice(index, 1);
    }
  }

  onSubmitDataSource(form: NgForm) {
    this.dataSources.push(_.clone(this.dataSource));
  }

  deleteDataSource(dataSource: any) {
    const index: number = this.dataSources.indexOf(dataSource);

    if (index >= 0) {
      this.dataSources.splice(index, 1);
    }
  }

  onCancel() {
    this.location.back();
  }

  filterFields(onlyVisible: boolean) {
    this.onlyVisible = onlyVisible;

    if (onlyVisible) {
      this.filteredFields = this.visibleFields;
    } else {
      this.filteredFields = this.fields;
    }
  }

  editFieldOptions(field: Field) {
    const options = (field.resources || {}).options || [];
    this.fieldOptionsForm.open(options);
  }

  updateVisible(visible: boolean, field: Field) {
    field.visible = visible;
    this.visibleFields = _.filter(this.fields, { visible: true });
  }

  removeField(fieldSet: FieldSet, field: Field) {
    const index: number = fieldSet.fields.indexOf(field);

    if (index >= 0) {
      fieldSet.fields.splice(index, 1);
    }
  }

  onLayerChange(layerName: string) {
    const layer = _.find(this.layers, { name: layerName });

    this.fields = layer.fields;
    this.filteredFields = layer.fields;

    this.visibleFields = _.filter(this.fields, { visible: true });
    // this.fieldSets = [{
    //   name: '',
    //   alias: '',
    //   type: 'geral',
    //   order: 0,
    //   fields: []
    // }];
  }

  configRules(fieldSet) {
    this.editingField = fieldSet.fields;
    this.fieldRulesForm.open();
  }

  onRulesChange(rules: FormFieldRule[]) {
    this.editingField.rules = rules;
  }

  loadMapServiceInfo() {
    if (this.mapServiceUrl) {
      this.mapService
        .getMapServiceData(this.mapServiceUrl, this.serviceType)
        .subscribe((result: any[]) => {
          if (this.serviceType === 'arcgis') {
            this.fields = result;
            this.filteredFields = result;
          } else if (this.serviceType === 'geo') {
            this.layers = result;
          }
        }, (error: any) => {
          // TODO: Handle error
          console.warn(error);
        });
    }
  }

  private create() {
    this.metalayersService
      .createMetalayerXml(this.companyId, this.areaTypeId, this.data)
      .subscribe(() => {
        this.announceSave(this.data);
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private update() {
    this.metalayersService
      .updateMetalayerXml(this.companyId, this.areaTypeId, this.data)
      .subscribe(() => {
        this.announceSave(this.data);
      }, (error: any) => {
        // TODO: Handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private announceSave(metalayer: Metalayer) {
    this.validated = false;
    this.fidValid = false;
    this.submiting = false;
    this.save.emit(metalayer);
  }

  private validateXml() {
    try {
      $.parseXML(this.data.settings);
    } catch (ex) {
      console.warn(ex);
      this.xmlValid = false;
    }
  }

}
