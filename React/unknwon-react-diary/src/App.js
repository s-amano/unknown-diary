import './App.css';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import ApiContextProvider from './context/ApiContext';
import Navbar from './component/Navbar';
import PostDiary from './component/PostDiary';
import FetchDiary from './component/FetchDiary';
import MyDiaryDetail from './component/MyDiaryDetail';
import FetchMyDiaries from './component/FetchMyDiaries';
import { Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <ApiContextProvider>
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
              <Route exact path="/mydiary-detail" component={MyDiaryDetail} />
              <Route exact path="/diary" component={FetchDiary} />
              <Route exact path="/" component={PostDiary} />
            </BrowserRouter>
          </header>
        </AmplifyAuthenticator>
      </div>
    </ApiContextProvider>
  );
}

export default App;
