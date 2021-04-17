import './App.css';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import Navbar from './component/Navbar';
import PostDiary from './component/PostDiary';
import FetchDiary from './component/FetchDiary';
import FetchMyDiaries from './component/FetchMyDiaries';
import { Route, BrowserRouter } from 'react-router-dom';

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
          <BrowserRouter>
            <Route exact path="/mydiary" component={FetchMyDiaries} />
            <Route exact path="/post" component={PostDiary} />
            <Route exact path="/" component={FetchDiary} />
          </BrowserRouter>
        </header>
      </AmplifyAuthenticator>
    </div>
  );
}

export default App;
