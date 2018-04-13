import { Directive, ElementRef, HostListener, Output, Input, EventEmitter } from '@angular/core';

@Directive({
  selector: '[sgt2Replace]'
})
export class ReplaceDirective {

  @Input('sgt2Replace') regExp: string;

  @Output() replaced: EventEmitter<string> = new EventEmitter<string>();

  constructor(private el: ElementRef) {
  }

  @HostListener('keyup.space', ['$event']) onkeyup(event) {
    const value = event.target.value;
    this.replaced.emit(value.replace(new RegExp(this.regExp, 'g'), ''));
  }

}
