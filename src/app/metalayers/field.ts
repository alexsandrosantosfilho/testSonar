export class Field {
  name: string;
  alias: string;
  type: string;
  editable: boolean;
  visible: boolean;
  nullable: boolean;
  resources: any;
  precision: number;
  rules: any[];
}

export interface FormFieldRule {
  operator: string;
  class: string;
  expected: string;
}
