import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';

import './index.css';
import reportWebVitals from './reportWebVitals';
import ViewModelProviders from './context/ViewModelProviders';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider>
        <ViewModelProviders>
          <App />
        </ViewModelProviders>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
