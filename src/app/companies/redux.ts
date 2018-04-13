import * as _ from 'lodash';

import { Company } from './company';

// ACTIONS

export interface CompanyAction {
  type: string;
  company?: Company;
  companies?: Company[];
}

export const addCompany = (company: Company) => {
  return {
    type: 'ADD_COMPANY',
    company
  };
};

export const updateCompany = (company: Company) => {
  return {
    type: 'UPDATE_COMPANY',
    company
  };
};

export const removeCompany = (company: Company) => {
  return {
    type: 'REMOVE_COMPANY',
    company
  };
};

export const initCompanies = (companies: Company[]) => {
  return {
    type: 'INIT_COMPANIES',
    companies
  };
};

export const resetCompanies = () => {
  return {
    type: 'RESET_COMPANIES'
  };
};

// REDUCERS

export const companiesReducers = (companies: Company[] = [], action: CompanyAction) => {
  switch (action.type) {
    case 'ADD_COMPANY':
      return [
        ...companies,
        action.company
      ];

    case 'UPDATE_COMPANY':
      return companies.map((company: Company) => {
        if (company.id === action.company.id) {
          return _.assign(new Company(), company, action.company);
        } else {
          return company;
        }
      });

    case 'REMOVE_COMPANY':
      return _.filter(companies, function(company: Company) {
          return company.id !== action.company.id;
      });

    case 'INIT_COMPANIES':
      return action.companies;

    case 'RESET_COMPANIES':
      return [];

    default:
      return companies;
  };

};
