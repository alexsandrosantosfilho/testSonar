import { Component, ElementRef, Output, Input, EventEmitter, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'sgt2-strong-confirmation-modal',
  templateUrl: './strong-confirmation-modal.component.html'
})
export class StrongConfirmationModalComponent implements AfterViewInit {

  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() confirm: EventEmitter<any> = new EventEmitter<any>();

  title: string;
  question: string;
  confirmationLabel: string;
  extraData: any;
  confirmed: boolean;
  validated: boolean;

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit() {
    $(this.el).find('.modal').on('hidden.bs.modal', (event: any) => {
      this.cancel.emit();
    });
  }

  open(title: string, question: string, confirmationLabel: string, extraData?: any) {
    this.title = title;
    this.question = question;
    this.confirmationLabel = confirmationLabel;
    this.extraData = extraData;
    this.confirmed = false;
    this.validated = false;
    $(this.el).find('.modal').modal();
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (this.confirmed) {
      this.confirm.emit(this.extraData);
      this.closeModal();
    }
  }

  private closeModal() {
    $(this.el).find('.modal').modal('hide');
  }

}
