import * as _ from 'lodash';

import { Component, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormFieldMetadata } from './form-field';

@Component({
  selector: 'sgt2-field-form',
  templateUrl: './field-form.component.html'
})
export class FieldFormComponent implements AfterViewInit {

  @Output() create: EventEmitter<any> = new EventEmitter<any>();
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  field: FormFieldMetadata;
  data: any = {};
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

  open(field?: FormFieldMetadata) {
    this.field = field;
    this.validated = false;

    if (field) {
      this.data = _.clone(field);
    }
    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      if (this.field) {
        this.update.emit(this.data);
      } else {
        this.create.emit(this.data);
      }

      this.closeModal();
    }
  }

  private resetForm() {
    this.data = {};
  }

  private closeModal() {
    $(this.el).find('.modal').modal('hide');
  }

}
