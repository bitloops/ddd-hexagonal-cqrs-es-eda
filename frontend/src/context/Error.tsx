import React, { createContext, useState, useContext, useMemo } from 'react';

export interface ErrorContextProps {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

interface ErrorProviderProps {
  children: React.ReactNode;
}

const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const errorState = useMemo(() => ({ error, setError }), []);
  return <ErrorContext.Provider value={errorState}>{children}</ErrorContext.Provider>;
};

function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
}

export { ErrorProvider, useErrorContext };
export default ErrorContext;
