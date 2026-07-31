import { useMemo, useState, type ReactNode } from 'react';

import ErrorContext from './ErrorContext';

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<string | null>(null);
  const errorState = useMemo(() => ({ error, setError }), [error]);

  return <ErrorContext.Provider value={errorState}>{children}</ErrorContext.Provider>;
}

export default ErrorProvider;
