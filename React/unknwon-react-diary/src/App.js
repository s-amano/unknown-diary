import './App.css';
import React from 'react';
import { I18n } from 'aws-amplify';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import ApiContextProvider from './context/ApiContext';
import Navbar from './component/Navbar';
import Login from './component/pages/Login';
import SignUp from './component/pages/SignUp';
import Footer from './component/Footer';
import Router from './router/Router';
import { BrowserRouter } from 'react-router-dom';
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
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <AmplifyAuthenticator>
          {authState === AuthState.SignedIn && user ? (
            <div className="App">
              <ApiContextProvider>
                <Navbar />
                <Router />
                <Footer />
              </ApiContextProvider>
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
  );
}

export default App;
