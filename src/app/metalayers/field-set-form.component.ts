import * as _ from 'lodash';

import { Component, ElementRef, Output, Input, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Field } from './field';
import { FieldSet } from './field-set';
import { Repository } from './repository';

@Component({
  selector: 'sgt2-field-set-form',
  templateUrl: './field-set-form.component.html'
})
export class FieldSetFormComponent implements AfterViewInit {

  @Output() create: EventEmitter<FieldSet> = new EventEmitter<FieldSet>();
  @Output() update: EventEmitter<FieldSet> = new EventEmitter<FieldSet>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  @Input() visibleFields: Field;

  fieldSet: FieldSet;
  data: any = { fields: [] };
  validated = false;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit() {
    $(this.el).find('.modal').on('hidden.bs.modal', (event: any) => {
      this.cancel.emit();
      this.resetForm();
    });
  }

  open(fieldSet?: FieldSet) {
    this.fieldSet = fieldSet;

    if (fieldSet) {
      this.data = _.cloneDeep(fieldSet);
    } else {
      this.data = {
        fields: _.cloneDeep(this.visibleFields)
      };
    }
    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      if (this.fieldSet) {
        this.update.emit(this.data);
      } else {
        this.create.emit(this.data);
      }

      this.closeModal();
    }
  }

  private resetForm() {
    this.data = { fields: [] };
    this.validated = false;
  }

  private closeModal() {
    $(this.el).find('.modal').modal('hide');
  }

}
