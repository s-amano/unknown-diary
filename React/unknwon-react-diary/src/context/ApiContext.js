import React, { createContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
export const ApiContext = createContext();

const ApiContextProvider = (props) => {
  const [thisUserName, setThisUserName] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Auth.currentUserInfo()
      .then((response) => {
        setThisUserName(response.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ApiContext.Provider
      value={{
        thisUserName,
        setThisUserName,
        loading,
        setLoading,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiContextProvider;
