import React, { createContext, useState } from 'react';
export const ApiContext = createContext();

const ApiContextProvider = (props) => {
  const [myDiaryDetail, setMyDiaryDetail] = useState([]);

  return (
    <ApiContext.Provider
      value={{
        myDiaryDetail,
        setMyDiaryDetail,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiContextProvider;
