import { Component, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormFieldMetadata, FormFieldOption } from './form-field';

@Component({
  selector: 'sgt2-field-options-form',
  templateUrl: './field-options-form.component.html'
})
export class FieldOptionsFormComponent implements AfterViewInit {

  @Output() optionsChange: EventEmitter<FormFieldOption[]> = new EventEmitter<FormFieldOption[]>();

  @Input() formTitle = 'Opções de escolha';

  options: FormFieldOption[] = [];
  optionValue: string;
  optionLabel: string;
  validated = false;
  editingOption: any;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit() {
    $(this.el).find('.modal').on('hidden.bs.modal', (event: any) => {
      this.resetForm();
    });
  }

  open(options: FormFieldOption[]) {
    this.options = options;
    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const option: any = {
        value: this.optionValue,
        label: this.optionLabel
      };

      if (this.editingOption) {
        const index: number = this.options.indexOf(this.editingOption);

        if (index >= 0) {
          this.options.splice(index, 1, option);
        }
      } else {
        this.options.push(option);
      }

      this.resetForm();
    }
  }

  saveResources() {
    this.optionsChange.emit(this.options);

    $(this.el).find('.modal').modal('hide');
  }

  editOption(option: any) {
    this.editingOption = option;
    this.optionLabel = option.label;
    this.optionValue = option.value;
  }

  deleteOption(option: any) {
    const index: number = this.options.indexOf(option);

    if (index >= 0) {
      this.options.splice(index, 1);
    }
  }

  private resetForm() {
    this.editingOption = null;
    this.optionValue = '';
    this.optionLabel = '';
    this.validated = false;
  }

}
