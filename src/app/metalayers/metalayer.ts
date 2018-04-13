import { Repository } from './repository';
import { FieldSet } from './field-set';
import { Field } from './field';

export interface Metalayer {
  id: number;
  metalayerId: number;
  name: string;
  category: string;
  order: number;
  enabled: boolean;
  visible: boolean;
  settings: any;
  fid: Field;
  repositories: Repository[];
  fieldSets: FieldSet[];
  fields: Field[];
  radius: number;
  opacity: number;
}

export interface RawMetalayer {
  id: number;
  dado: string;
}
