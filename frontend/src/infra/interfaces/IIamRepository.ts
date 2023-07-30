import { User } from '../../models/User';

export interface IIamRepository {
  loginWithEmailPassword(email: string, password: string): Promise<User>;
  registerWithEmailPassword(email: string, password: string): Promise<void>;
  isAuthenticated(): boolean;
}
