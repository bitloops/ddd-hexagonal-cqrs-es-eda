import type { ReactNode } from 'react';

import { DIContext, initialContext } from './DIContext';

interface DIProviderProps {
  children: ReactNode;
}

export function DIProvider({ children }: DIProviderProps) {
  return <DIContext.Provider value={initialContext}>{children}</DIContext.Provider>;
}

export default DIProvider;
