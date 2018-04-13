import * as _ from 'lodash';

import { Component, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormFieldMetadata, FormFieldOption } from '../shared/components/dynamic-form/form-field';

@Component({
  selector: 'sgt2-type-form',
  templateUrl: './type-form.component.html'
})
export class TypeFormComponent implements AfterViewInit {

  @Output() optionUpdate: EventEmitter<FormFieldOption> = new EventEmitter<FormFieldOption>();
  @Output() optionSave: EventEmitter<FormFieldOption> = new EventEmitter<FormFieldOption>();

  @Input() formTitle = 'Opções de escolha';

  option: FormFieldOption;
  data: any = {};
  validated = false;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit() {
    $(this.el).find('.modal').on('hidden.bs.modal', (event: any) => {
      this.resetForm();
    });
  }

  open(option?: FormFieldOption) {
    if (option) {
      this.option = option;
      this.data = _.clone(option);
    }

    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      if (this.option) {
        this.optionUpdate.emit(this.data);
      } else {
        this.optionSave.emit(this.data);
      }
    }

    $(this.el).find('.modal').modal('hide');
  }

  private resetForm() {
    this.option = null;
    this.data = {};
    this.validated = false;
  }

}
