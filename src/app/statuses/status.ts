export interface Status {
  id: number;
  name: string;
  icon?: StatusIcon;
}

export interface StatusIcon {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface RawStatus {
  id: number;
  name: string;
  icon: string;
}
