import { Field } from './field';

export interface FieldSet {
  name: string;
  alias: string;
  type: string;
  order: number;
  fields: Field[];
}
