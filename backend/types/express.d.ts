import { Request } from 'express';

interface User {
  id: string;
  nom: string;
  prenon: string;
  dateNaissance:Date;
  sexe: string;
  email: string;
}

declare module 'express' {
  interface Request {
    user?: User;
  }
}
