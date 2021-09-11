import React, { createContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
export const ApiContext = createContext();

const ApiContextProvider = (props) => {
  const [myDiaryDetail, setMyDiaryDetail] = useState([]);
  const [thisUserName, setThisUserName] = useState([]);

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
        myDiaryDetail,
        setMyDiaryDetail,
        thisUserName,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiContextProvider;
