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
import MyFavoritesDiaries from './component/MyFavoritesDiaries';
import Home from './component/Home';
import Footer from './component/Footer';
import { Route, BrowserRouter } from 'react-router-dom';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { vocabularies } from './vocabularies';

I18n.putVocabularies(vocabularies);
I18n.setLanguage('ja');

const theme = createTheme({
  palette: {
    primary: {
      main: '#6e7d84',
    },
    secondary: {
      main: 'rgba(67, 56, 202)',
    },
  },
  typography: {
    fontFamily: 'Comic Neue',
  },
  shadows: ['none'],
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
                <Route exact path="/post" component={PostDiary} />
                <Route exact path="/" component={Home} />
                <Route exact path="/favorites" component={MyFavoritesDiaries} />
                <Footer />
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
