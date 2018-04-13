import * as _ from 'lodash';

import { Component, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Field } from './field';
import { Repository } from './repository';

@Component({
  selector: 'sgt2-repository-form',
  templateUrl: './repository-form.component.html'
})
export class RepositoryFormComponent implements AfterViewInit {

  @Output() create: EventEmitter<Repository> = new EventEmitter<Repository>();
  @Output() update: EventEmitter<Repository> = new EventEmitter<Repository>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  repository: Repository;
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

  open(repository?: Repository) {
    this.repository = repository;

    if (repository) {
      this.data = _.clone(repository);
    }
    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      if (this.repository) {
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
