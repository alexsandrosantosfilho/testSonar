export class Company {

  id: string;
  name: string;
  geoserver: boolean;  
  logo: CompanyLogo;
  reportLogo: CompanyLogo;
  settings: any;

  getChartsConfig() {
    return this.settings.charts || [];
  }

}

export interface CompanyLogo {
  id: number;
  height: number;
  width: number;
  url: string;
}

export interface RawCompany {
  id: string;
  nome: string;
  logo: string;
  geoserver: boolean;  
  logo_print: string;
  settings: string;
}
