import { Component, ElementRef, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'sgt2-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: [ './about-modal.component.scss' ]
})
export class AboutModalComponent implements OnInit {

  appVersion: string;  
  private el: HTMLElement;

  constructor(
    el: ElementRef,
    private settings: SettingsService    
  ) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.appVersion = this.settings.getAppVersion();
  }

  open() {
    $(this.el).find('.modal').modal();
  }

  private closeModal() {
    $(this.el).find('.modal').modal('hide');
  }

}
