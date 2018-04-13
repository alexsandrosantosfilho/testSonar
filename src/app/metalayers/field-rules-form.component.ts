import * as _ from 'lodash';

import { AfterViewInit, Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Field, FormFieldRule } from './field';

@Component({
  selector: 'sgt2-field-rules-form',
  templateUrl: './field-rules-form.component.html'
})
export class FieldRulesFormComponent implements AfterViewInit {

  @Output() rulesChange: EventEmitter<FormFieldRule[]> = new EventEmitter<FormFieldRule[]>();

  @Input() fields: Field[] = [];

  rules: FormFieldRule[] = [];
  data: any = {};
  validated = false;
  editingRule: any;
  editingField: any;
  fieldName: string;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit() {
    $(this.el).find('.modal').on('hidden.bs.modal', (event: any) => {
      this.resetForm();
    });
  }

  open() {
    // this.rules = (rules || []).map((rule: FormFieldRule) => {
    //   if (rule.operator == 'equals') {
    //     rule.operator = '===';
    //   }
    //   return rule;
    // });

    this.validated = false;
    this.data = {};

    $(this.el).find('.modal').modal();
  }

  onFieldsChange(fieldName: string) {
    this.fieldName = fieldName;
    const field = _.find(this.fields, { name: this.fieldName });
    this.editingField = field;

    if (!field.rules[0]) {
      this.rules = [];
    } else {
      this.rules = field.rules;
    }

  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      if (this.editingRule) {
        const index: number = this.rules.indexOf(this.editingRule);

        if (index >= 0) {
          this.rules.splice(index, 1, this.data);
        }
      } else {
        this.rules.push(_.clone(this.data));
        this.editingField.rules = this.rules;
        this.rulesChange.emit(this.rules);
      }

      this.resetForm();
    }

  }

  saveRules() {
    this.resetAll();
    $(this.el).find('.modal').modal('hide');
  }

  editRule(rule: any) {
    this.editingRule = rule;
    this.data = _.clone(rule);
  }

  deleteRule(rule: any) {
    const index: number = this.rules.indexOf(rule);

    if (index >= 0) {
      this.rules.splice(index, 1);
    }
  }

  private resetForm() {
    this.data = {};
    this.validated = false;
    this.editingRule = null;
  }

  private resetAll() {
    this.rules = [];
    this.fieldName = '';
  }

}
