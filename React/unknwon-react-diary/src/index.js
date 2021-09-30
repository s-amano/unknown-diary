import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

const env = process.env.REACT_APP_ENVIROMENT;
const envAPI = env === 'prod' ? process.env.REACT_APP_PROD_API_ENDPOINT : process.env.REACT_APP_DEV_API_ENDPOINT;

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
        name: 'POSTStoreAPI',
        endpoint: envAPI + 'post',
        region: region,
      },
      {
        name: 'GETStoreAPI',
        endpoint: envAPI + 'get',
        region: region,
      },
      {
        name: 'GETMyDiariesAPI',
        endpoint: envAPI + 'get/mydiaries',
        region: region,
      },
      {
        name: 'REACTIONDiaryAPI',
        endpoint: envAPI + 'reaction',
        region: region,
      },
      {
        name: 'UPDATEDiaryAPI',
        endpoint: envAPI + 'update',
        region: region,
      },
      {
        name: 'COMMENTDiaryAPI',
        endpoint: envAPI + 'comment',
        region: region,
      },
      {
        name: 'FAVORITESDiaryAPI',
        endpoint: envAPI + 'get/favorites',
        region: region,
      },
    ],
  },
});

ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();
