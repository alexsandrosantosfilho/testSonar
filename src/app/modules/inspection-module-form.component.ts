import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { TypeFormComponent } from './type-form.component';
import { FormFieldMetadata, FormFieldOption } from '../shared/components/dynamic-form/form-field';
import { Module } from './module';
import { DynamicFormConfigComponent } from '../shared/components/dynamic-form/dynamic-form-config.component';

@Component({
  selector: 'sgt2-inspection-module-form',
  templateUrl: './inspection-module-form.component.html'
})
export class InspectionModuleFormComponent implements OnChanges {

  @Output() moduleChange: EventEmitter<Module> = new EventEmitter<Module>();

  @Input() module: Module;

  complaintFields: FormFieldMetadata[] = [];
  surveyFields: FormFieldMetadata[] = [];
  interventionFields: FormFieldMetadata[] = [];
  complaintTypes: FormFieldOption[];
  denunciatorTypes: FormFieldOption[];
  surveyTypes: FormFieldOption[];
  interventionTypes: FormFieldOption[];
  formTitle = '';
  editingType: FormFieldOption;

  complaintExternalFields: FormFieldMetadata[] = [
    {
      name: 'type',
      label: 'Tipo'
    }
  ];

  surveyExternalFields: FormFieldMetadata[] = [
    {
      name: 'type',
      label: 'Tipo'
    }
  ];

  interventionExternalFields: FormFieldMetadata[] = [
    {
      name: 'type',
      label: 'Tipo'
    }
  ];

  @ViewChild('complaintTypeForm')
  private complaintTypeForm: TypeFormComponent;

  @ViewChild('denunciatorTypeForm')
  private denunciatorTypeForm: TypeFormComponent;

  @ViewChild('surveyTypeForm')
  private surveyTypeForm: TypeFormComponent;

  @ViewChild('interventionTypeForm')
  private interventionTypeForm: TypeFormComponent;

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes && changes['module'] && this.module) {
      this.complaintFields = _.get(this.module, 'settings.complaint.form.fields', []);
      this.surveyFields = _.get(this.module, 'settings.survey.form.fields', []);
      this.interventionFields = _.get(this.module, 'settings.intervention.form.fields', []);

      this.complaintTypes = _.get(this.module, 'settings.complaint.types', []);
      this.denunciatorTypes = _.get(this.module, 'settings.denunciator.types', []);
      this.surveyTypes = _.get(this.module, 'settings.survey.types', []);
      this.interventionTypes = _.get(this.module, 'settings.intervention.types', []);
    }
  }

  onOptionsChange(options: FormFieldOption[]) {
    if (options === this.complaintTypes) {
      this.complaintTypes = options;
    } else if (options === this.surveyTypes) {
      this.surveyTypes = options;
    } else if (options === this.interventionTypes) {
      this.interventionTypes = options;
    } else if (options === this.denunciatorTypes) {
      this.denunciatorTypes = options;
    }
  }

  // Add
  addComplaintType() {
    this.complaintTypeForm.open();
  }

  addDenunciatorType() {
    this.denunciatorTypeForm.open();
  }

  addSurveyType() {
    this.surveyTypeForm.open();
  }

  addInterventionType() {
    this.interventionTypeForm.open();
  }

  // Edit
  editComplaintType(type: FormFieldOption) {
    this.editingType = type;
    this.complaintTypeForm.open(type);
  }

  editDenunciatorType(type: FormFieldOption) {
    this.editingType = type;
    this.denunciatorTypeForm.open(type);
  }

  editSurveyType(type: FormFieldOption) {
    this.editingType = type;
    this.surveyTypeForm.open(type);
  }

  editInterventionType(type: FormFieldOption) {
    this.editingType = type;
    this.interventionTypeForm.open(type);
  }

  // Delete
  deleteComplaintType(type: FormFieldOption) {
    const index: number = this.complaintTypes.indexOf(type);

    if (index >= 0) {
      this.complaintTypes.splice(index, 1);
    }
  }

  deleteDenunciatorType(type: FormFieldOption) {
    const index: number = this.denunciatorTypes.indexOf(type);

    if (index >= 0) {
      this.denunciatorTypes.splice(index, 1);
    }
  }

  deleteSurveyType(type: FormFieldOption) {
    const index: number = this.surveyTypes.indexOf(type);

    if (index >= 0) {
      this.surveyTypes.splice(index, 1);
    }
  }

  deleteInterventionType(type: FormFieldOption) {
    const index: number = this.interventionTypes.indexOf(type);

    if (index >= 0) {
      this.interventionTypes.splice(index, 1);
    }
  }

  // Save
  onSaveComplaintType(type: FormFieldOption) {
    this.complaintTypes.push(type);
    this.complaintTypes = _.sortBy(this.complaintTypes, 'label');
    _.set(this.module, 'settings.complaint.types', this.complaintTypes);
    this.moduleChange.emit(this.module);
  }

  onSaveDenunciatorType(type: FormFieldOption) {
    this.denunciatorTypes.push(type);
    this.denunciatorTypes = _.sortBy(this.denunciatorTypes, 'label');
    _.set(this.module, 'settings.denunciator.types', this.denunciatorTypes);
    this.moduleChange.emit(this.module);
  }

  onSaveSurveyType(type: FormFieldOption) {
    this.surveyTypes.push(type);
    this.surveyTypes = _.sortBy(this.surveyTypes, 'label');
    _.set(this.module, 'settings.survey.types', this.surveyTypes);
    this.moduleChange.emit(this.module);
  }

  onSaveInterventionType(type: FormFieldOption) {
    this.interventionTypes.push(type);
    this.interventionTypes = _.sortBy(this.interventionTypes, 'label');
    _.set(this.module, 'settings.intervention.types', this.interventionTypes);
    this.moduleChange.emit(this.module);
  }

  // Update
  onUpdateComplaintType(type: FormFieldOption) {
    _.assign(this.editingType, type);
    _.set(this.module, 'settings.complaint.types', this.complaintTypes);
    this.
    moduleChange.emit(this.module);
  }

  onUpdateDenunciatorType(type: FormFieldOption) {
    _.assign(this.editingType, type);
    _.set(this.module, 'settings.denunciator.types', this.denunciatorTypes);
    this.moduleChange.emit(this.module);
  }

  onUpdateSurveyType(type: FormFieldOption) {
    _.assign(this.editingType, type);
    _.set(this.module, 'settings.survey.types', this.surveyTypes);
    this.moduleChange.emit(this.module);
  }

  onUpdateInterventionType(type: FormFieldOption) {
    _.assign(this.editingType, type);
    _.set(this.module, 'settings.intervention.types', this.interventionTypes);
    this.moduleChange.emit(this.module);
  }

  onComplaintFieldsChange(fields: FormFieldMetadata[]) {
    this.complaintFields = fields;
    _.set(this.module, 'settings.complaint.form.fields', fields);
    this.moduleChange.emit(this.module);
  }

  onSurveyFieldsChange(fields: FormFieldMetadata[]) {
    this.surveyFields = fields;
    _.set(this.module, 'settings.survey.form.fields', fields);
    this.moduleChange.emit(this.module);
  }

  onInterventionFieldsChange(fields: FormFieldMetadata[]) {
    this.interventionFields = fields;
    _.set(this.module, 'settings.intervention.form.fields', fields);
    this.moduleChange.emit(this.module);
  }

}
