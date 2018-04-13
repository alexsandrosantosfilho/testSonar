import * as _ from 'lodash';

import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef, Renderer
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { Company } from './company';
import { CompaniesService } from './companies.service';
import { FileManagerConfig } from '../core/models';
import { FileManagerService } from '../core/services';

@Component({
  selector: 'sgt2-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: [ './company-form.component.scss' ]
})
export class CompanyFormComponent implements OnChanges {

  @Output() save: EventEmitter<Company> = new EventEmitter<Company>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  @Input() company: Company;

  data: Company = new Company();
  logoUrl = '';
  logoReportUrl = '';
  charts: string;
  image: File;
  reportImage: File;
  validated = false;
  imageValid = true;
  imageReportValid = true;
  allowedExtensions: string[] = [ 'jpeg', 'jpg', 'png' ];
  imageValidationMessage: string;
  editing = false;
  submiting = false;
  idExist = false;
  submitingLogo = false;
  submitingLogoRp = false;
  idLengthValid = true;

  @ViewChild('fileInput')
  private fileInput: ElementRef;

  @ViewChild('fileReportInput')
  private fileReportInput: ElementRef;

  constructor(
    private companiesService: CompaniesService,
    private fileManagerService: FileManagerService,
    private renderer: Renderer
  ) {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes && changes['company'] && this.company) {
      this.data = this.company;
      this.logoUrl = this.company.logo ? this.company.logo.url : '';
      this.logoReportUrl = this.company.reportLogo ? this.company.reportLogo.url : '';
      this.charts = this.company.getChartsConfig().join(', ');
      this.editing = true;
    }
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      this.submiting = true;
      const charts: number[] = (this.charts || '').split(',').map((id: any) => +id);

      if (!this.data.settings) {
        this.data.settings = {};
      }
      this.data.settings.charts = _.compact(charts);

      if (this.editing) {
        this.update();
      } else {
        this.create();
      }
    }
  }

  onCancel() {
    this.cancel.emit(null);
  }

  onIdExist() {
    this.idExist = false
  }
  

  browseFile() {
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'click', []);
  }

  browseReportFile() {
    this.renderer.invokeElementMethod(this.fileReportInput.nativeElement, 'click', []);
  }

  onImageChange(event: any) {
    this.submitingLogo = true;

    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];

      if (file) {
        this.image = file;
        this.validateImage();

        if (this.imageValid) {
          this.uploadLogo(this.company.id, this.image);
        }
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  onImageReportChange(event: any) {
    this.submitingLogoRp = true;

    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];

      if (file) {
        this.reportImage = file;
        this.validateImage(true);

        if (this.imageReportValid) {
          this.uploadReportLogo(this.company.id, this.reportImage);
        }
        this.fileReportInput.nativeElement.value = '';
      }
    }
  }

  removeLogo() {
    this.fileManagerService
      .deleteFile(this.data.logo.id)
      .subscribe(() => {
        this.data.logo = undefined;
        this.logoUrl = '';
        this.update();
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
      });
  }

  removeReportLogo() {
    this.fileManagerService
      .deleteFile(this.data.reportLogo.id)
      .subscribe(() => {
        this.data.reportLogo = undefined;
        this.logoReportUrl = '';
        this.update();
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
      });
  }

  private create() {
    this.idLengthValid = this.data.id && this.data.id.length > 1;
   
    if (this.idLengthValid){
      this.companiesService
      .createCompany(this.data)
      .subscribe((company: Company) => {
        this.announceSave(company);
      }, (error: any) => {
        this.submiting = false;
        console.warn(error);

        if (error.status === 422) {
          if (error._body === '{"id":["Já existe!"]}') {
            this.idExist = true;
          }
        }
      });
    } else {
      this.submiting = false;
    }
  }

  private update() {
    this.companiesService
      .updateCompany(this.data)
      .subscribe((company: Company) => {
        this.announceSave(company);
      }, (error: any) => {
        // TODO: handle error
        console.warn(error);
        this.submiting = false;
      });
  }

  private announceSave(company: Company) {
    this.validated = false;
    this.submiting = false;
    this.idExist = false;
    this.idLengthValid = true;
    this.save.emit(company);
  }

  private validateImage(imageType?: boolean) {
    if (imageType) {
      this.imageReportValid = true;
      const fileExtension: string = this.reportImage.name.split('.').pop() || '';

      if (!_.includes(this.allowedExtensions, fileExtension)) {
        this.imageValidationMessage = `A extensão de arquivo "${fileExtension}" não é permitida. As extensões permitidas são: ${this.allowedExtensions.join(', ')}.`;
        this.imageReportValid = false;
        this.reportImage = undefined;
      }
    } else {
      this.imageValid = true;
      const fileExtension: string = this.image.name.split('.').pop() || '';

      if (!_.includes(this.allowedExtensions, fileExtension)) {
        this.imageValidationMessage = `A extensão de arquivo "${fileExtension}" não é permitida. As extensões permitidas são: ${this.allowedExtensions.join(', ')}.`;
        this.imageValid = false;
        this.image = undefined;
      }
    }
  }

  private uploadLogo(companyId: string, file: File) {
    const config: FileManagerConfig = {
      path: `companies/${companyId}`,
      group: 'branding',
      categ: 'logotypes',
      entity: 'header'
    };

    this.fileManagerService
      .uploadFile(file, config)
      .then((logo: any) => {
        const img = new Image();
        img.onload = () => {
          this.logoUrl = logo.url;
          this.data.logo = _.assign(logo, {
            width: img.width,
            height: img.height
          });
          this.submitingLogo = false;
          this.update();
        };
        img.src = logo.url;
      }).catch((error: any) => {
        // TODO: handle error
        this.submitingLogo = false;
      });
  }

  private uploadReportLogo(companyId: string, file: File) {
    const config: FileManagerConfig = {
      path: `companies/${companyId}`,
      group: 'branding',
      categ: 'logotypes_print',
      entity: 'header'
    };

    this.fileManagerService
      .uploadFile(file, config)
      .then((logo: any) => {
        const img = new Image();

        img.onload = () => {
          this.logoReportUrl = logo.url;
          this.data.reportLogo = _.assign(logo, {
            width: img.width,
            height: img.height
          });
          this.submitingLogoRp = false;
          this.update();
        };
        img.src = logo.url;
      }).catch((error: any) => {
        // TODO: handle error
        this.submitingLogoRp = false;
      });
  }

}
