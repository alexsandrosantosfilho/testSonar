import { FormFieldMetadata, FormFieldOption } from '../shared/components/dynamic-form/form-field';

export interface Module {
  id: string;
  name: string;
  label: string;
  enabled: boolean;
  settings: any;
}

export interface ModuleSettings {
  complaint:    { types: FormFieldOption[], form: { fields: FormFieldMetadata[] }};
  survey:       { types: FormFieldOption[], form: { fields: FormFieldMetadata[] }};
  intervention: { types: FormFieldOption[], form: { fields: FormFieldMetadata[] }};
  denunciator:  { types: FormFieldOption[] };
}

export interface RawModule {
  id: string;
  name: string;
  enable: boolean;
  settings: string;
}
