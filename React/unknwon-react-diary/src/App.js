import './App.css';
import React from 'react';
import { I18n } from 'aws-amplify';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import ApiContextProvider from './context/ApiContext';
import Navbar from './component/Navbar';
import Login from './component/Login';
import SignUp from './component/SignUp';
import PostDiary from './component/PostDiary';
import FetchDiary from './component/FetchDiary';
import MyDiaryDetail from './component/MyDiaryDetail';
import MyProfile from './component/MyProfile';
import { Route, BrowserRouter } from 'react-router-dom';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import About from './component/About';
import { vocabularies } from './vocabularies';

I18n.putVocabularies(vocabularies);
I18n.setLanguage('ja');

const theme = createTheme({
  palette: {
    primary: {
      main: '#81c784',
    },
    secondary: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Comic Neue',
  },
});

function App() {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);
  return (
    <ApiContextProvider>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <AmplifyAuthenticator>
            {authState === AuthState.SignedIn && user ? (
              <div className="App">
                <Navbar />
                <Route exact path="/mydiary" component={MyProfile} />
                <Route exact path="/mydiary-detail" component={MyDiaryDetail} />
                <Route exact path="/diary" component={FetchDiary} />
                <Route exact path="/" component={PostDiary} />
              </div>
            ) : (
              <>
                <Login />
                <SignUp />
              </>
            )}
          </AmplifyAuthenticator>
        </BrowserRouter>
      </MuiThemeProvider>
    </ApiContextProvider>
  );
}

export default App;
