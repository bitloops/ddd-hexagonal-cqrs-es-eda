import { TODO_LOCAL_STORAGE_KEY, USER_LOCAL_STORAGE_KEY } from '../constants';
import { type Todo } from '../models/Todo';
import { type User } from '../models/User';

class LocalStorageRepository {
  private static encryptionKey = 'your-secure-key'; // Replace with a securely managed key

  private static encryptData(data: string): string {
    // Implement encryption logic here
    return btoa(data); // Example: Base64 encoding (replace with actual encryption)
  }

  private static decryptData(data: string): string {
    // Implement decryption logic here
    return atob(data); // Example: Base64 decoding (replace with actual decryption)
  }
  static getLocalStorageObject<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        const decryptedData = LocalStorageRepository.decryptData(value);
        return JSON.parse(decryptedData) as T;
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
    const encryptedData = LocalStorageRepository.encryptData(JSON.stringify(object));
    localStorage.setItem(key, encryptedData);
  }

  static clearAll(): void {
    localStorage.clear();
    window.localStorage.clear();
  }
}

export default LocalStorageRepository;
