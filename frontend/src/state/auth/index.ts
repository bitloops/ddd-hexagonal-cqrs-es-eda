import { atom, selector } from 'recoil';
import { Email, Password } from '../../models/Auth';

function isEmailValid(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

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
  // set: ({ set }, newValue) => set(emailState, newValue),
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
