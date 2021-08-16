import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

const env = process.env.REACT_APP_ENVIROMENT;

const region = 'ap-northeast-1';

const userpoolIdEnv = () => {
  console.log(env);
  if (env === 'prod') {
    return process.env.REACT_APP_PROD_USERPOOL;
  } else if (env === 'dev') {
    return process.env.REACT_APP_DEV_USERPOOL;
  }
};

const userPoolWebClientIdEnv = () => {
  console.log(env);
  if (env === 'prod') {
    return process.env.REACT_APP_PROD_USERPOOL_WEBCLIENT;
  } else if (env === 'dev') {
    return process.env.REACT_APP_DEV_USERPOOL_WEBCLIENT;
  }
};

Amplify.configure({
  Auth: {
    region: region,
    userPoolId: userpoolIdEnv(),
    userPoolWebClientId: userPoolWebClientIdEnv(),
  },
  API: {
    endpoints: [
      {
        name: 'POSTStoreAPIDev',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/post',
        region: region,
      },
      {
        name: 'GETStoreAPIDev',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/get',
        region: region,
      },
      {
        name: 'GETMyDiariesAPIDev',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/get/mydiaries',
        region: region,
      },
      {
        name: 'UPDATEDiaryAPIDev',
        endpoint: 'https://c3xw1225c3.execute-api.ap-northeast-1.amazonaws.com/dev/reaction',
        region: region,
      },
      {
        name: 'POSTStoreAPIProd',
        endpoint: 'https://n1ek4zl4n9.execute-api.ap-northeast-1.amazonaws.com/prod/post',
        region: region,
      },
      {
        name: 'GETStoreAPIProd',
        endpoint: 'https://n1ek4zl4n9.execute-api.ap-northeast-1.amazonaws.com/prod/get',
        region: region,
      },
      {
        name: 'GETMyDiariesAPIProd',
        endpoint: 'https://n1ek4zl4n9.execute-api.ap-northeast-1.amazonaws.com/prod/get/mydiaries',
        region: region,
      },
      {
        name: 'UPDATEDiaryAPIProd',
        endpoint: 'https://n1ek4zl4n9.execute-api.ap-northeast-1.amazonaws.com/prod/reaction',
        region: region,
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
