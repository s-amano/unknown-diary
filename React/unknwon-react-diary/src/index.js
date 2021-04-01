import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: 'ap-northeast-1_fRLMpBIT7',
    userPoolWebClientId: 'js5roe560vem1ccntvkpfuit',
  },
  API: {
    endpoints: [
      {
        name: 'TestAPI',
        endpoint: 'https://tej1860lph.execute-api.ap-northeast-1.amazonaws.com/dev/test/get',
        region: 'ap-northeast-1',
      },
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(consolse.log))sss
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vditals
reportWebVitals();
