type InvalidEmail = { value: string; isValid: false; message: string | null };
export type ValidEmail = { value: string; isValid: true; message: null };
export type Email = InvalidEmail | ValidEmail;

type InvalidPassword = { value: string; isValid: false; message: string | null };
export type ValidPassword = { value: string; isValid: true; message: null };
export type Password = ValidPassword | InvalidPassword;

export type AuthMessage = {
  type: 'error' | 'success';
  message: string;
  startAt: number;
  duration: number;
};
