import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

const env = process.env.REACT_APP_ENVIROMENT;

const region = 'ap-northeast-1';

Amplify.configure({
  Auth: {
    region: region,
    userPoolId: env === 'prod' ? process.env.REACT_APP_PROD_USERPOOL : process.env.REACT_APP_DEV_USERPOOL,
    userPoolWebClientId:
      env === 'prod' ? process.env.REACT_APP_PROD_USERPOOL_WEBCLIENT : process.env.REACT_APP_DEV_USERPOOL_WEBCLIENT,
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
        name: 'COMMENTDiaryAPIDev',
        endpoint: process.env.REACT_APP_DEV_API_ENDPOINT + 'comment',
        region: region,
      },
      {
        name: 'FAVORITESDiaryAPIDev',
        endpoint: process.env.REACT_APP_DEV_API_ENDPOINT + 'get/favorites',
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
      {
        name: 'COMMENTDiaryAPIProd',
        endpoint: process.env.REACT_APP_PROD_API_ENDPOINT + 'comment',
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
