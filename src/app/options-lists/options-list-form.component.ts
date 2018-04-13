import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { OptionFormComponent } from './option-form.component';
import { FormFieldMetadata, FormFieldOption } from '../shared/components/dynamic-form/form-field';
import { DynamicFormConfigComponent } from '../shared/components/dynamic-form/dynamic-form-config.component';
import { OptionsList } from './options-list';
import { OptionsListsService } from './options-lists.service';

@Component({
  selector: 'sgt2-options-list-form',
  templateUrl: './options-list-form.component.html'
})

export class OptionsListFormComponent implements OnChanges {

  @Output() save: EventEmitter<OptionsList> = new EventEmitter<OptionsList>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  @Input() companyId: string;
  @Input() optionsList: OptionsList;

  data: any = {};
  validated = false;
  submiting = false;
  options: FormFieldOption[] = [];
  editingOption: FormFieldOption;

  @ViewChild('optionForm')
  private optionForm: OptionFormComponent;

  constructor(
    private optionsListService: OptionsListsService
  ) {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes && changes['optionsList'] && this.optionsList) {
      this.data = this.optionsList;
      this.options = <any> _.get(this.optionsList, 'options', []);
    }
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid && this.options.length) {
      this.submiting = true;

      if (this.optionsList) {
        this.update();
      } else {
        this.create();
      }
    }
  }

  onCancel() {
    this.cancel.emit(null);
  }

  addOption() {
    this.optionForm.open();
  }

  editOption(option: any) {
    this.editingOption = option;
    this.optionForm.open(option);
  }

  deleteOption(option: any) {
    const index: number = this.options.indexOf(option);

    if (index >= 0) {
      this.options.splice(index, 1);
    }
  }

  onSaveOption(option: any) {
    this.options.push(option);
    this.options = _.sortBy(this.options, 'label');
    _.set(this.data, 'options', this.options);
  }

  onUpdateOption(option: FormFieldOption) {
    _.assign(this.editingOption, option);
    _.set(this.data, 'options', this.options);
  }

  private create() {
    this.optionsListService
      .createOptionsList(this.companyId, this.data)
      .subscribe((optionsList: OptionsList) => {
        this.announceSave(optionsList);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private update() {
    this.optionsListService
      .updateOptionsList(this.companyId, this.data)
      .subscribe((optionsList: OptionsList) => {
        this.announceSave(optionsList);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private announceSave(optionsList: OptionsList) {
    this.validated = false;
    this.submiting = false;
    this.save.emit(optionsList);
  }

}
