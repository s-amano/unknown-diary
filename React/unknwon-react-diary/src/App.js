import './App.css';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import ApiContextProvider from './context/ApiContext';
import Navbar from './component/Navbar';
import Login from './component/Login';
import PostDiary from './component/PostDiary';
import FetchDiary from './component/FetchDiary';
import MyDiaryDetail from './component/MyDiaryDetail';
import FetchMyDiaries from './component/FetchMyDiaries';
import { Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <ApiContextProvider>
      <AmplifyAuthenticator>
        <BrowserRouter>
          <Login />
          <div className="App">
            <Navbar />
            <Route exact path="/mydiary" component={FetchMyDiaries} />
            <Route exact path="/mydiary-detail" component={MyDiaryDetail} />
            <Route exact path="/diary" component={FetchDiary} />
            <Route exact path="/" component={PostDiary} />
          </div>
        </BrowserRouter>
      </AmplifyAuthenticator>
    </ApiContextProvider>
  );
}

export default App;
