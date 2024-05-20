import { User } from '../modules/user/entities/user.entity';

export interface AuthUser {
  username: string;
  userId: string;
  iat: number;
  exp: number;
}

export interface IAuthenticatedReq extends Request {
  user: User;
}
