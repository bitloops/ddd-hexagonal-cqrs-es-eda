import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';

export interface ErrorContextProps {
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export function useErrorContext(): ErrorContextProps {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
}

export default ErrorContext;
