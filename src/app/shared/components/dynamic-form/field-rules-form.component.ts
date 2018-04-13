import * as _ from 'lodash';

import { AfterViewInit, Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FormFieldMetadata, FormFieldRule } from './form-field';

@Component({
  selector: 'sgt2-field-rules-form',
  templateUrl: './field-rules-form.component.html'
})
export class FieldRulesFormComponent implements AfterViewInit {

  @Output() rulesChange: EventEmitter<FormFieldRule[]> = new EventEmitter<FormFieldRule[]>();

  @Input() fields: FormFieldMetadata[] = [];
  @Input() externalFields: FormFieldMetadata[] = [];

  rules: FormFieldRule[] = [];
  data: any = {};
  validated = false;
  editingRule: any;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit() {
    $(this.el).find('.modal').on('hidden.bs.modal', (event: any) => {
      this.resetForm();
    });
  }

  open(rules: FormFieldRule[]) {
    this.rules = (rules || []).map((rule: FormFieldRule) => {
      if (rule.operator === 'equals') {
        rule.operator = '===';
      }
      return rule;
    });
    this.validated = false;
    this.data = {};

    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const comparisonValues: string[] = (this.data.expected || '').split(',').map(value => value.trim());
      const expected = _.compact(comparisonValues);
      const data = Object.assign({}, this.data, { expected });

      if (this.editingRule) {
        const index: number = this.rules.indexOf(this.editingRule);

        if (index >= 0) {
          this.rules.splice(index, 1, data);
        }
      } else {
        this.rules.push(_.clone(data));
      }

      this.resetForm();
    }

  }

  saveRules() {
    this.rulesChange.emit(this.rules);
    $(this.el).find('.modal').modal('hide');
  }

  editRule(rule: any) {
    this.editingRule = rule;
    const expected: string = Array.isArray(rule.expected) ? rule.expected.join(', ') : rule.expected;
    this.data = Object.assign({}, rule, { expected });
  }

  deleteRule(rule: any) {
    const index: number = this.rules.indexOf(rule);

    if (index >= 0) {
      this.rules.splice(index, 1);
    }
  }

  private resetForm() {
    this.editingRule = null;
    this.data = {};
    this.validated = false;
  }

}
