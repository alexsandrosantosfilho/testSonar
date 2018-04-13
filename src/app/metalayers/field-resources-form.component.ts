import { Component, ElementRef, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Field } from './field';

@Component({
  selector: 'sgt2-field-resources-form',
  templateUrl: './field-resources-form.component.html'
})
export class FieldResourcesFormComponent {

  field: Field;
  optionValue: string;
  optionLabel: string;
  options: any[] = [];
  validated = false;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  open(field: Field) {
    this.field = field;
    this.options = field.resources ? field.resources.options : [];
    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      this.options.push({
        value: this.optionValue,
        label: this.optionLabel
      });
      this.resetForm();
    }
  }

  saveResources() {
    this.field.resources = {
      options: this.options
    };

    $(this.el).find('.modal').modal('hide');
  }

  deleteOption(option: any) {
    const index: number = this.options.indexOf(option);

    if (index >= 0) {
      this.options.splice(index, 1);
    }
  }

  private resetForm() {
    this.optionValue = '';
    this.optionLabel = '';
    this.validated = false;
  }

}
