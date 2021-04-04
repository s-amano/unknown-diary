import logo from './logo.svg';
import './App.css';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp } from '@aws-amplify/ui-react';
import { Auth, API } from 'aws-amplify';

function App() {
  const survayPost = async function () {
    const apiName = 'POSTStoreAPI';
    const path = '';

    const postData = {
      title: 'testタイトル',
      content: 'てすと',
    };
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
      body: postData,
      contentType: 'application/json',
    };

    API.post(apiName, path, myInit)
      .then(() => {
        console.log('成功');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="App">
      <AmplifyAuthenticator>
        <AmplifySignUp
          slot="sign-up"
          formFields={[
            {
              type: 'username',
              required: true,
              placeholder: 'Enter your name',
            },
            {
              type: 'password',
              required: true,
            },
          ]}
        />

        <header className="App-header">
          <div className="container">
            <button id="button" onClick={() => survayPost()}>
              Click Me!
            </button>
          </div>
          <AmplifySignOut />
        </header>
      </AmplifyAuthenticator>
    </div>
  );
}

export default App;
