import { atom, selector } from 'recoil';
import { AuthMessage, Email, Password } from '../../models/Auth';
import { User } from '../../models/User';

function isEmailValid(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const authMessageState = atom<AuthMessage | null>({
  key: 'auth/authMessage',
  default: null,
});

export const emailState = atom<string>({
  key: 'auth/email',
  default: '',
});

export const emailSelector = selector<Email>({
  key: 'auth/emailSelector',
  get: ({ get }) => {
    const email = get(emailState);
    if (email === '') {
      return { value: email, isValid: false, message: null };
    }
    if (isEmailValid(email)) {
      return { value: email, isValid: true, message: null };
    }
    return {
      value: email,
      isValid: false,
      message: 'Please enter a valid email address',
    };
  },
});

export const userState = atom<User | null>({
  key: 'auth/user',
  default: null,
});

export const isAuthenticatedSelector = selector<boolean>({
  key: 'auth/isAuthenticated',
  get: ({ get }) => {
    const user = get(userState);
    return user !== null;
  },
});

export const isProcessingState = atom<boolean>({
  key: 'auth/isProcessing',
  default: false,
});

export const passwordState = atom<string>({
  key: 'auth/password',
  default: '',
});

export const passwordSelector = selector<Password>({
  key: 'auth/passwordSelector',
  get: ({ get }) => {
    const password = get(passwordState);
    if (password === '') {
      return { value: password, isValid: false, message: null };
    }
    if (password.length < 8) {
      return {
        value: password,
        isValid: false,
        message: 'Password must be at least 8 characters long',
      };
    }
    return { value: password, isValid: true, message: null };
  },
});
