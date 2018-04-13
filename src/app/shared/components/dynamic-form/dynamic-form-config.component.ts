import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormFieldMetadata, FormFieldRule, FormFieldOption } from './form-field';
import { FieldFormComponent } from './field-form.component';
import { FieldOptionsFormComponent } from './field-options-form.component';
import { FieldRulesFormComponent } from './field-rules-form.component';

@Component({
  selector: 'sgt2-dynamic-form-config',
  templateUrl: './dynamic-form-config.component.html'
})
export class DynamicFormConfigComponent implements OnChanges {

  @Output() fieldsChange: EventEmitter<FormFieldMetadata[]> = new EventEmitter<FormFieldMetadata[]>();

  @Input() formTitle = '';
  @Input() fields: FormFieldMetadata[] = [];
  @Input() externalFields: FormFieldMetadata[] = [];

  editingField: FormFieldMetadata;

  @ViewChild('fieldForm')
  private fieldForm: FieldFormComponent;

  @ViewChild('fieldOptionsForm')
  private fieldOptionsForm: FieldOptionsFormComponent;

  @ViewChild('fieldRulesForm')
  private fieldRulesForm: FieldRulesFormComponent;

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes && changes['fields'] && this.fields.length) {
      this.fields = _.sortBy(this.fields, ['order']);
    }
  }

  onSaveField(field) {
    this.fields.push(field);
    this.fields = _.sortBy(this.fields, ['order']);
    this.fieldsChange.emit(this.fields);
  }

  onUpdateField(field) {
    _.assign(this.editingField, field);
  }

  onCancelField() {
    this.editingField = null;
  }

  editField(field: FormFieldMetadata) {
    this.editingField = field;
    this.fieldForm.open(field);
  }

  addField() {
    this.fieldForm.open();
  }

  deleteField(field: FormFieldMetadata) {
    const index: number = this.fields.indexOf(field);

    if (index >= 0) {
      this.fields.splice(index, 1);
    }

    this.fieldsChange.emit(this.fields);
  }

  editFieldOptions(field) {
    const options = _.get(field, 'resources.options', []);
    this.editingField = field;
    this.fieldOptionsForm.open(options);
  }

  configRules(field) {
    this.editingField = field;
    this.fieldRulesForm.open(field.rules);
  }

  onRulesChange(rules: FormFieldRule[]) {
    this.editingField.rules = rules;
    this.fieldsChange.emit(this.fields);
  }

  onOptionsChange(options: FormFieldOption[]) {
    _.set(this.editingField, 'resources.options', options);
    this.fieldsChange.emit(this.fields);
  }

}
