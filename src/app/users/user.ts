export interface User {
  id: string;
  domain: string;
  name: string;
  email: string;
  login: string;
  root: boolean;
  password?: string;
}
