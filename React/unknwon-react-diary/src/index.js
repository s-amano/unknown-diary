import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

const env = process.env.REACT_APP_ENVIROMENT;

const userpoolIdEnv = () => {
  console.log(env);
  if (env === 'prod') {
    return 'ap-northeast-1_SGhA5k2tK';
  } else if (env === 'dev') {
    return 'ap-northeast-1_Ti2rjpXht';
  }
};

const userPoolWebClientIdEnv = () => {
  console.log(env);
  if (env === 'prod') {
    return '5s9ftbi8f5pde1u4djlknhpgib';
  } else if (env === 'dev') {
    return '59h992ke2hcpi367054n2bt2tt';
  }
};

Amplify.configure({
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: userpoolIdEnv(),
    userPoolWebClientId: userPoolWebClientIdEnv(),
  },
  API: {
    endpoints: [
      {
        name: 'POSTStoreAPIDev',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/post',
        region: 'ap-northeast-1',
      },
      {
        name: 'GETStoreAPIDev',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/get',
        region: 'ap-northeast-1',
      },
      {
        name: 'GETMyDiariesAPIDev',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/get/mydiaries',
        region: 'ap-northeast-1',
      },
      {
        name: 'POSTStoreAPIProd',
        endpoint: 'https://n1ek4zl4n9.execute-api.ap-northeast-1.amazonaws.com/prod/post',
        region: 'ap-northeast-1',
      },
      {
        name: 'GETStoreAPIProd',
        endpoint: 'https://n1ek4zl4n9.execute-api.ap-northeast-1.amazonaws.com/prod/get',
        region: 'ap-northeast-1',
      },
      {
        name: 'GETMyDiariesAPIProd',
        endpoint: 'https://n1ek4zl4n9.execute-api.ap-northeast-1.amazonaws.com/prod/get/mydiaries',
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
