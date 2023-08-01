import { createContext, useContext, useMemo } from 'react';
import { SetterOrUpdater, useRecoilValue } from 'recoil';
import { User } from '../models/User';
import { useIamRepository } from '../context/DI';
import { AuthMessage, Email, Password, ValidEmail, ValidPassword } from '../models/Auth';
import { EventBus, Events } from '../Events';
import { AUTH_MESSAGE_DURATION } from '../constants';
import {
  authMessageState,
  emailSelector,
  isAuthenticatedSelector,
  isProcessingState,
  passwordSelector,
  userState,
} from '../state/auth';
import { IIamRepository } from '../infra/interfaces/IIamRepository';

interface IIamViewModel {
  loginWithGoogle: () => Promise<void | Error>;
  loginWithEmailPassword: (
    email: ValidEmail,
    password: ValidPassword,
    onSuccessCallback: () => void
  ) => Promise<void>;
  logout: () => void;
  registerWithEmailPassword: (
    email: ValidEmail,
    password: ValidPassword,
    onSuccessCallback: () => void
  ) => Promise<void>;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
  setGetters: (
    getUser: () => User | null,
    getEmail: () => Email | null,
    getPassword: () => Password | null
  ) => void;
  setSetters: (
    setAuthMessage: SetterOrUpdater<AuthMessage | null>,
    setUser: SetterOrUpdater<User | null>,
    setEmail: SetterOrUpdater<string>,
    setPassword: SetterOrUpdater<string>,
    setIsProcessing: SetterOrUpdater<boolean>
  ) => void;
  useIamSelectors: () => {
    authMessage: AuthMessage | null;
    email: Email | null;
    isAuthenticated: boolean;
    isProcessing: boolean;
    password: Password | null;
    user: User | null;
  };
}

class IamViewModel implements IIamViewModel {
  private setters: {
    setAuthMessage: SetterOrUpdater<AuthMessage | null> | null;
    setUser: SetterOrUpdater<User | null> | null;
    setEmail: SetterOrUpdater<string> | null;
    setPassword: SetterOrUpdater<string> | null;
    setIsProcessing: SetterOrUpdater<boolean> | null;
  } = {
    setAuthMessage: null,
    setUser: null,
    setEmail: null,
    setPassword: null,
    setIsProcessing: null,
  };

  private getters: {
    getUser: (() => User | null) | null;
    getEmail: (() => Email | null) | null;
    getPassword: (() => Password | null) | null;
  } = {
    getUser: null,
    getEmail: null,
    getPassword: null,
  };

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private iamRepository: IIamRepository) {}

  init = () => {
    console.debug('IamViewModel constructor', this.iamRepository);
    this.setUser(this.iamRepository.getUser());
  };

  setSetters = (
    setAuthMessage: SetterOrUpdater<AuthMessage | null>,
    setUser: SetterOrUpdater<User | null>,
    setEmail: SetterOrUpdater<string>,
    setPassword: SetterOrUpdater<string>,
    setIsProcessing: SetterOrUpdater<boolean>
  ) => {
    this.setters.setAuthMessage = setAuthMessage;
    this.setters.setUser = setUser;
    this.setters.setEmail = setEmail;
    this.setters.setPassword = setPassword;
    this.setters.setIsProcessing = setIsProcessing;
  };

  setGetters = (
    getUser: () => User | null,
    getEmail: () => Email | null,
    getPassword: () => Password | null
  ) => {
    this.getters.getUser = getUser;
    this.getters.getEmail = getEmail;
    this.getters.getPassword = getPassword;
  };

  registerWithEmailPassword = async (
    email: ValidEmail,
    password: ValidPassword,
    onSuccessCallback: () => void
  ): Promise<void> => {
    this.setIsProcessing(true);
    try {
      await this.iamRepository.registerWithEmailPassword(email.value, password.value);
      this.setAuthMessage({
        type: 'success',
        message: 'Registered successfully!',
        startAt: Date.now(),
        duration: AUTH_MESSAGE_DURATION,
      });
      onSuccessCallback();
    } catch (error) {
      this.setAuthMessage({
        type: 'error',
        message: (error as Error).message,
        startAt: Date.now(),
        duration: AUTH_MESSAGE_DURATION,
      });
    }
    this.setIsProcessing(false);
  };

  loginWithEmailPassword = async (
    email: ValidEmail,
    password: ValidPassword,
    onSuccessCallback: () => void
  ): Promise<void> => {
    this.setIsProcessing(true);
    try {
      const user = await this.iamRepository.loginWithEmailPassword(email.value, password.value);
      this.setUser(user);
      this.setAuthMessage({
        type: 'success',
        message: 'Login successful!',
        startAt: Date.now(),
        duration: AUTH_MESSAGE_DURATION,
      });
      onSuccessCallback();
    } catch (error) {
      this.setAuthMessage({
        type: 'error',
        message: (error as Error).message,
        startAt: Date.now(),
        duration: AUTH_MESSAGE_DURATION,
      });
    }
    this.setIsProcessing(false);
  };

  loginWithGoogle = async (): Promise<void> => {
    throw new Error('Not implemented');
  };

  logout = () => {
    this.iamRepository.logout();
    this.setUser(null);
    this.setAuthMessage(null);
    this.updateEmail('');
    this.updatePassword('');
  };

  updateEmail = (email: string) => {
    if (this.setters.setEmail) this.setters.setEmail(email);
    else throw new Error('setters.setEmail is not set');
  };

  updatePassword = (password: string) => {
    if (this.setters.setPassword) this.setters.setPassword(password);
    else throw new Error('setters.setPassword is not set');
  };

  useIamSelectors = () => ({
    authMessage: useRecoilValue(authMessageState),
    email: useRecoilValue(emailSelector),
    isProcessing: useRecoilValue(isProcessingState),
    isAuthenticated: useRecoilValue(isAuthenticatedSelector),
    password: useRecoilValue(passwordSelector),
    user: useRecoilValue(userState),
  });

  private setAuthMessage = (message: AuthMessage | null) => {
    if (this.setters.setAuthMessage) {
      this.setters.setAuthMessage(message);
    } else {
      throw new Error('setAuthMessage is not set');
    }
  };

  private setUser = (user: User | null) => {
    if (this.setters.setUser) this.setters.setUser(user);
    else throw new Error('setters.setUser is null');
    EventBus.emit(Events.AUTH_CHANGED, user);
    if (user) {
      this.iamRepository.setUser(user);
    } else this.iamRepository.logout();
  };

  private setIsProcessing = (isProcessing: boolean) => {
    if (this.setters.setIsProcessing) this.setters.setIsProcessing(isProcessing);
    else throw new Error('setters.setIsProcessing is null');
  };
}

const IamViewModelContext = createContext<IamViewModel | null>(null);

export interface IamViewModelProviderProps {
  children: React.ReactNode;
}

const IamViewModelProvider: React.FC<IamViewModelProviderProps> = ({
  children,
}: IamViewModelProviderProps) => {
  const iamRepository = useIamRepository();
  const loginViewModel = useMemo(() => new IamViewModel(iamRepository), [iamRepository]);

  return (
    <IamViewModelContext.Provider value={loginViewModel}>{children}</IamViewModelContext.Provider>
  );
};

const useIamViewModel = () => {
  const viewModel = useContext(IamViewModelContext);
  if (!viewModel) throw new Error('No IamViewModel provided');
  return viewModel;
};

export { IamViewModel, IamViewModelProvider, IamViewModelContext, useIamViewModel };
