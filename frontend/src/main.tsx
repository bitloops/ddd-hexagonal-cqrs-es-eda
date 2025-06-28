import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultSystem } from '@chakra-ui/react';
import './index.css';
import ViewModelProviders from './context/ViewModelProviders';
import { Provider as ReduxProvider } from 'react-redux'
import { store as reduxStore } from './store/store'
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <ReduxProvider store={reduxStore}>
        <ChakraProvider value={defaultSystem}>
          <ViewModelProviders>
            <App />
          </ViewModelProviders>
        </ChakraProvider>
      </ReduxProvider>
    </RecoilRoot>
  </StrictMode>,
)
