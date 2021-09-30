import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Auth, API } from 'aws-amplify';

export default function useFethcDiary() {
  const location = useLocation();
  const [diary, setDiary] = useState({});

  const fetchDiary = async () => {
    const apiName = 'GETStoreAPI';
    const path = `${location.search}`;

    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };

    await API.get(apiName, path, myInit)
      .then((response) => {
        setDiary(response);
        return diary;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };
  return { diary, fetchDiary };
}
