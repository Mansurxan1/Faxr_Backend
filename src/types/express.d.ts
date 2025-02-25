import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  cookies: {
    jwt?: string;
  };
  body: any; // Можно сделать более строгую типизацию для каждого маршрута
} 