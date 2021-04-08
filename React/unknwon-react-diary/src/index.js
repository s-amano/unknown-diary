import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: 'ap-northeast-1_Ti2rjpXht',
    userPoolWebClientId: '59h992ke2hcpi367054n2bt2tt',
  },
  API: {
    endpoints: [
      {
        name: 'POSTStoreAPI',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/post',
        region: 'ap-northeast-1',
      },
      {
        name: 'GETStoreAPI',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/get',
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

reportWebVitals();
