import React, { useContext, useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import { ApiContext } from '../context/ApiContext';
import { useLocation, Redirect } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';

const MyDiaryDetail = () => {
  // const { myDiaryDetail } = useContext(ApiContext);
  const location = useLocation();
  const [myDiaryDetail, setMyDiaryDetail] = useState([]);

  useEffect(() => {
    const envFetchAPI = () => {
      const env = process.env.REACT_APP_ENVIROMENT;
      console.log(env);
      if (env === 'prod') {
        return 'GETStoreAPIProd';
      } else if (env === 'dev') {
        return 'GETStoreAPIDev';
      }
    };

    const fetchMyDiary = async () => {
      const apiName = envFetchAPI();
      const path = `${location.search}`;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          console.log(response);
          if (response.id === '') {
            window.location.href = '/mydiary';
          }
          setMyDiaryDetail(response);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchMyDiary();
  }, []);

  return (
    <Container style={{ marginTop: '20px' }} maxWidth="md">
      <Grid container justifyContent="space-around" style={{ marginTop: '8%', marginBottom: '5%' }}>
        <Typography variant="h5" component="h2" style={{ marginBottom: '2%' }}>
          {myDiaryDetail.title ? myDiaryDetail.title : 'タイトル'}
        </Typography>
        <Typography variant="subtitle1" component="h2">
          {myDiaryDetail.date ? myDiaryDetail.date : '日付'}
        </Typography>
      </Grid>
      <TextField
        style={{ width: '100%', marginBottom: '5%' }}
        multiline
        rows={20}
        value={myDiaryDetail.content}
        disabled
      />
      <Grid container justify="flex-end">
        <Button variant="contained" color="primary">
          <FavoriteIcon style={{ marginRight: '2%' }} color="error" />
          <p style={{ margin: 0, fontWeight: 'bold', color: 'white', fontSize: '16px' }}>{myDiaryDetail.reaction}</p>
        </Button>
      </Grid>
    </Container>
  );
};

export default MyDiaryDetail;
