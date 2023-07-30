import { TODO_LOCAL_STORAGE_KEY, USER_LOCAL_STORAGE_KEY } from '../constants';
import Todo from '../models/Todo';
import { User } from '../models/User';

class LocalStorageRepository {
  static getLocalStorageObject<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        throw new Error('Could not parse local storage object');
      }
    }
    return null;
  }

  static getLocalStorageValue(key: string): string | null {
    const token = localStorage.getItem(key);
    if (token) {
      return token;
    }
    return null;
  }

  static setLocalStorageValue(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static getAccessToken(): string | null {
    return LocalStorageRepository.getUser()?.jwt ?? null;
  }

  // static setAccessToken(token: string): void {
  //   LocalStorageRepository.setLocalStorageValue(IAM_ACCESS_TOKEN_LOCAL_STORAGE_KEY, token);
  // }

  static setUser(user: User | null): void {
    LocalStorageRepository.setLocalStorageObject<User | null>(USER_LOCAL_STORAGE_KEY, user);
  }

  static getUser(): User | null {
    return LocalStorageRepository.getLocalStorageObject<User>(USER_LOCAL_STORAGE_KEY);
  }

  static getAllTodo(): Todo[] | null {
    return LocalStorageRepository.getLocalStorageObject<Todo[]>(TODO_LOCAL_STORAGE_KEY);
  }

  static setLocalStorageObject<T>(key: string, object: T): void {
    localStorage.setItem(key, JSON.stringify(object));
  }

  static clearAll(): void {
    localStorage.clear();
    window.localStorage.clear();
  }
}

export default LocalStorageRepository;
