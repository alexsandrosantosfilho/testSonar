export interface FormFieldResources {
  options?: FormFieldOption[];
}

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldRule {
  action: string;
  operator: string;
  references: string;
  expected: string | string[];
}

export interface FormFieldMetadata {
  name: string;
  label: string;
  editable?: boolean;
  order?: number;
  controlType?: string;
  resources?: FormFieldResources;
  rules?: FormFieldRule[];
}
