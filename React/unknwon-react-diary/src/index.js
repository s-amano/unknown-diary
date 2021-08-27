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
        endpoint: process.env.REACT_APP_DEV_API_ENDPOINT + 'post',
        region: region,
      },
      {
        name: 'GETStoreAPIDev',
        endpoint: process.env.REACT_APP_DEV_API_ENDPOINT + 'get',
        region: region,
      },
      {
        name: 'GETMyDiariesAPIDev',
        endpoint: process.env.REACT_APP_DEV_API_ENDPOINT + 'get/mydiaries',
        region: region,
      },
      {
        name: 'REACTIONDiaryAPIDev',
        endpoint: process.env.REACT_APP_DEV_API_ENDPOINT + 'reaction',
        region: region,
      },
      {
        name: 'UPDATEDiaryAPIDev',
        endpoint: process.env.REACT_APP_DEV_API_ENDPOINT + 'update',
        region: region,
      },
      {
        name: 'POSTStoreAPIProd',
        endpoint: process.env.REACT_APP_PROD_API_ENDPOINT + 'post',
        region: region,
      },
      {
        name: 'GETStoreAPIProd',
        endpoint: process.env.REACT_APP_PROD_API_ENDPOINT + 'get',
        region: region,
      },
      {
        name: 'GETMyDiariesAPIProd',
        endpoint: process.env.REACT_APP_PROD_API_ENDPOINT + 'get/mydiaries',
        region: region,
      },
      {
        name: 'REACTIONDiaryAPIProd',
        endpoint: process.env.REACT_APP_PROD_API_ENDPOINT + 'reaction',
        region: region,
      },
      {
        name: 'UPDATEDiaryAPIProd',
        endpoint: process.env.REACT_APP_PROD_API_ENDPOINT + 'update',
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
