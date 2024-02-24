import { jwtDecode } from 'jwt-decode';
import { IIamRepository } from '../../interfaces/IIamRepository';
import { User } from '../../../models/User';
import { IIamService } from '../../interfaces/IIamService';
import { EventBus, Events } from '../../../Events';
import LocalStorageRepository from '../../LocalStorage';

export type DecodedToken = {
  sub: string;
  exp: number;
  iat: number;
};

const clearLocalStorage = (): void => {
  localStorage.clear();
  window.localStorage.clear();
};

const isExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token) as DecodedToken;
    const now = Date.now().valueOf() / 1000; // in seconds
    return decoded.exp < now;
  } catch (err) {
    console.error(err);
    return false;
  }
  // Get the current timestamp
};

class IamRepository implements IIamRepository {
  constructor(private iamService: IIamService) {
    EventBus.subscribe(Events.AUTH_CHANGED, this.setUser);
  }

  async loginWithEmailPassword(email: string, password: string): Promise<User> {
    const loginResponse = await this.iamService.loginWithEmailPassword(email, password);
    const token = loginResponse.access_token;
    console.log('setting access token', loginResponse);
    try {
      const decoded = jwtDecode(token) as DecodedToken;
      const user: User = { id: decoded.sub, jwt: token };
      this.setUser(user);
      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async registerWithEmailPassword(email: string, password: string): Promise<void> {
    await this.iamService.registerWithEmailPassword(email, password);
  }

  isAuthenticated(): boolean {
    const token = LocalStorageRepository.getAccessToken();
    if (token === null) return false;
    return true;
  }

  logout(): void {
    LocalStorageRepository.clearAll();
    EventBus.emit(Events.AUTH_CHANGED, null);
  }

  getUser(): User | null {
    const token = LocalStorageRepository.getAccessToken();
    if (token === null) return null;
    try {
      const decoded = jwtDecode(token) as DecodedToken;
      if (isExpired(token)) {
        clearLocalStorage();
        return null;
      }
      const user: User = { id: decoded.sub, jwt: token };
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  setUser(user: User | null) {
    LocalStorageRepository.setUser(user);
  }
}

export { IamRepository };
