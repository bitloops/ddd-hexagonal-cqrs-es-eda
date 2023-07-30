import { User } from '../../../models/User';

export type IamResponse = {
  status: 'success' | 'cached';
  user: User;
};

interface IIamRepository {
  loginWithEmailPassword(email: string, password: string): Promise<User>;
  registerWithEmailPassword(email: string, password: string): Promise<void>;
  isAuthenticated(): boolean;
  logout(): void;
  getUser(): User | null;
  setUser(user: User): void;
}

export { IamRepository } from './IamRepository';
export type { IIamRepository };
