import './App.css';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import Navbar from './component/Navbar';
import DiaryPost from './component/DiaryPost';

function App() {
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
        <Navbar />
        <header className="App-header">
          <div className="container">
            <DiaryPost />
          </div>
        </header>
      </AmplifyAuthenticator>
    </div>
  );
}

export default App;
