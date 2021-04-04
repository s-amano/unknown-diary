import logo from './logo.svg';
import './App.css';
import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp } from '@aws-amplify/ui-react';
import { Auth, API } from 'aws-amplify';

function App() {
  const showSecret = async function () {
    const apiName = 'TestAPI';
    const path = '';
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };

    API.get(apiName, path, myInit)
      .then((response) => {
        console.log(response);
        alert(response.Body);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
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
            <button id="button" onClick={() => showSecret()}>
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
