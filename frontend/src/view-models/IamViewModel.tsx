import { createContext, useContext, useMemo } from 'react';
import { makeAutoObservable } from 'mobx';
import { IIamRepository } from '../infra/repositories/iam';
import { User } from '../models/User';
import { useIamRepository } from '../context/DI';
import { ValidEmail, ValidPassword } from '../models/Auth';
import { EventBus, Events } from '../Events';

interface IIamViewModel {
  isAuthenticated: boolean | null;
  user: User | null;
  setUser: (user: User | null) => void;
  isProcessing: boolean;
  authMessage: { type: 'error' | 'success'; message: string } | null;
  loginWithGoogle: () => Promise<void | Error>;
  logout: () => void;
  loginWithEmailPassword: (
    email: ValidEmail,
    password: ValidPassword,
    onSuccessCallback: () => void
  ) => Promise<void>;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
}

class IamViewModel implements IIamViewModel {
  private _email = '';

  private _password = '';

  private _isAuthenticated: boolean | null = null;

  private _isProcessing = false;

  private _user: User | null = null;

  private _authMessage: { type: 'error' | 'success'; message: string } | null = null;

  constructor(private iamRepository: IIamRepository) {
    makeAutoObservable(this);
    console.log('IamViewModel constructor', iamRepository);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncCallback = (data: any) => {
    console.log('asyncCallback', data);
    const { event, session } = data;
    const jwt = session?.access_token;
    const user = session?.user;
    const uid = user?.id;
    const name = user?.user_metadata?.full_name;
    if (!(jwt && uid && name)) {
      this._isAuthenticated = false;
      this._user = null;
    }

    switch (event) {
      case 'INITIAL_SESSION':
        console.log('switch INITIAL_SESSION', session);
        if (jwt && uid && name) {
          this._isAuthenticated = true;
          this._user = { id: uid, name, jwt };
        } else {
          this._isAuthenticated = false;
          this._user = null;
        }
        break;
      case 'SIGNED_IN':
        console.log('switch SIGNED_IN', session);
        if (jwt && uid && name) {
          this._isAuthenticated = true;
          this._user = { id: uid, name, jwt };
        }
        break;
      case 'SIGNED_OUT':
        console.log('switch SIGNED_OUT', session);
        this._isAuthenticated = false;
        this._user = null;
        break;
      default:
        console.log('switch DEFAULT', event, session);
        break;
    }
  };

  get isProcessing(): boolean {
    return this._isProcessing;
  }

  get isAuthenticated() {
    if (this._isAuthenticated === null) {
      this._isAuthenticated = this.iamRepository.isAuthenticated();
      if (this._isAuthenticated) {
        this._user = this.iamRepository.getUser();
        EventBus.emit(Events.AUTH_CHANGED, this._user);
      }
    }
    return this._isAuthenticated;
  }

  get user() {
    if (this._isAuthenticated === null) {
      this._isAuthenticated = this.iamRepository.isAuthenticated();
      if (this._isAuthenticated) {
        this._user = this.iamRepository.getUser();
      }
    }
    return this._user;
  }

  setUser(user: User | null) {
    this._user = user;
    console.log('emitting AUTH_CHANGED');
    EventBus.emit(Events.AUTH_CHANGED, user);
    if (user) {
      this.iamRepository.setUser(user);
    } else this.iamRepository.logout();
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get authMessage() {
    if (this._authMessage) {
      setTimeout(() => {
        this.clearAuthMessage();
      }, 5000);
    }
    return this._authMessage;
  }

  private setAuthMessage = (message: { type: 'error' | 'success'; message: string } | null) => {
    this._authMessage = message;
  };

  private setIsAuthenticated = (isAuthenticated: boolean | null) => {
    this._isAuthenticated = isAuthenticated;
  };

  // private setUser = (user: User | null) => {
  //   this._user = user;
  // };

  private clearAuthMessage = () => {
    this._authMessage = null;
  };

  registerWithEmailPassword = async (): Promise<void> => {
    this._isProcessing = true;
    try {
      await this.iamRepository.registerWithEmailPassword(this._email, this._password);
      this.setAuthMessage({ type: 'success', message: 'Registered successfully!' });
    } catch (error) {
      this.setAuthMessage({ type: 'error', message: (error as Error).message });
    }
    this._isProcessing = false;
  };

  loginWithEmailPassword = async (
    email: ValidEmail,
    password: ValidPassword,
    onSuccessCallback: () => void
  ): Promise<void> => {
    this._isProcessing = true;
    try {
      const user = await this.iamRepository.loginWithEmailPassword(email.value, password.value);
      this.setIsAuthenticated(true);
      this.setUser(user);
      this.setAuthMessage({ type: 'success', message: 'Login successful!' });
      onSuccessCallback();
    } catch (error) {
      // console.log(error);
      this.setAuthMessage({ type: 'error', message: (error as Error).message });
    }
    this._isProcessing = false;
  };

  loginWithGoogle = async (): Promise<void> => {
    throw new Error('Not implemented');
  };

  logout = () => {
    this.iamRepository.logout();
    this._isAuthenticated = false;
    this._user = null;
  };

  updateEmail = (email: string) => {
    this._email = email;
  };

  updatePassword = (password: string) => {
    this._password = password;
  };

  clearEmail = () => {
    this._email = '';
  };

  clearPassword = () => {
    this._password = '';
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

  // useEffect(() => {
  //   // iamRepository.onAuthStateChanged((user: User) => {
  //   //   loginViewModel.asyncCallback(user);
  //   // });
  // }, []);

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
