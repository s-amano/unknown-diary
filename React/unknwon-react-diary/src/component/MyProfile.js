import React, { useEffect, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import FetchMyDiaries from './FetchMyDiaries';
import StatisticalDataCard from './StatisticalDataCard';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const MyProfile = () => {
  const [myDiaries, setMyDiaries] = useState([]);

  useEffect(() => {
    const fetchMyDiaries = async () => {
      const apiName = 'GETMyDiariesAPI';
      const path = '';

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          console.log(response.Diaries);
          setMyDiaries(response.Diaries);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchMyDiaries();
  }, []);
  return (
    <Container style={{ marginTop: '40px' }} maxWidth="md">
      <Typography style={{ marginTop: '30px', color: 'black' }} variant="h6">
        貴方のプロフィール
      </Typography>
      <StatisticalDataCard myDiaries={myDiaries} />
      <FetchMyDiaries myDiaries={myDiaries} />
    </Container>
  );
};

export default MyProfile;
