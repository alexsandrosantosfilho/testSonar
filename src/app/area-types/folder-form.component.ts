import * as _ from 'lodash';

import { Component, ElementRef, Output, Input, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'sgt2-folder-form',
  templateUrl: './folder-form.component.html'
})
export class FolderFormComponent implements AfterViewInit {

  @Output() create: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() update: EventEmitter<any[]> = new EventEmitter<any[]>();

  title: string;
  folder: any;
  data: any = {};
  validated = false;
  inputId: string;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit() {
    $(this.el).find('.modal').on('hidden.bs.modal', (event: any) => {
      this.resetForm();
    });
  }

  open(folder?) {
    this.folder = folder;
    this.validated = false;

    if (folder) {
      this.data = _.clone(folder);
      this.title = 'Editar diretório';
    } else {
      this.title = 'Adicionar diretório';
    }
    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      if (this.folder) {
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
