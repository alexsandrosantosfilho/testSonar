import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[sgt2Tooltip]'
})
export class TooltipDirective implements AfterViewInit {

  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit() {
    $(this.el).tooltip();
  }

}
