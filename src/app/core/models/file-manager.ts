export interface FileManagerSettings {
  allowedExtensions: string[];
  fileMaxSize: number;
}

export interface FileManagerConfig {
  path: string;
  group: string;
  categ: string;
  entity: string;
  user?: string;
}

export enum FileStatus {
  NEW,
  UPLOADED,
  DELETED
}

export interface FileDescriptor {
  id: number;
  name: string;
  url: string;
}
