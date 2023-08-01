export type LoginResponse = {
  access_token: string;
};

export type AuthOptions = {
  idToken: string | null;
};

export type GetUserResponse = {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
};

export type UpdateUserDetailsRequest = {
  userId: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  name?: string;
  phone?: string;
};

export interface IIamService {
  loginWithEmailPassword(email: string, password: string): Promise<LoginResponse>;
  registerWithEmailPassword(email: string, password: string): Promise<void>;
}
