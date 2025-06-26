import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultSystem } from '@chakra-ui/react';
import './index.css';
import ViewModelProviders from './context/ViewModelProviders';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <ChakraProvider value={defaultSystem}>
        <ViewModelProviders>
          <App />
        </ViewModelProviders>
      </ChakraProvider>
    </RecoilRoot>
  </StrictMode>,
)
