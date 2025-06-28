import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultSystem } from '@chakra-ui/react';
import './index.css';
import { Provider as ReduxProvider } from 'react-redux'
import { store as reduxStore } from './store/store'
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={reduxStore}>
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    </ReduxProvider>
  </StrictMode>,
)
