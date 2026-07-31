import type { User } from '../../models/User';

export interface IIamRepository {
  login(): Promise<void>;
  register(): Promise<void>;
  completeLogin(): Promise<User>;
  logout(): Promise<void>;
  completeLogout(): Promise<void>;
  getUser(): Promise<User | null>;
}
