import React, { useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';

const DiaryFetch = () => {
  const [diary, setDiary] = useState({});

  const envAPI = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log(env);
    if (env === 'prod') {
      return 'GETStoreAPIProd';
    } else if (env === 'dev') {
      return 'GETStoreAPIDev';
    }
  };

  const fetchDiary = async () => {
    const apiName = envAPI();
    const path = '';

    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };

    await API.get(apiName, path, myInit)
      .then((response) => {
        console.log(response);
        setDiary(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const upadteDiary = async () => {
    const apiName = 'UPDATEDiaryAPIDev';
    const path = '';

    const postData = {
      id: diary.id,
      post_at: diary.post_at,
    };
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
      body: postData,
      contentType: 'application/json',
    };

    await API.post(apiName, path, myInit)
      .then(() => {
        console.log('成功');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container style={{ marginTop: '20px' }} maxWidth="md">
      <Grid container>
        <Button variant="contained" color="primary">
          <Link to="/mydiary" style={{ textDecoration: 'none', color: 'white' }}>
            自分の日記を取得
          </Link>
        </Button>
      </Grid>
      <Grid container justify="flex-end">
        <Button variant="contained" color="primary">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            日記を書く
          </Link>
        </Button>
      </Grid>
      <Typography style={{ marginTop: '30px', color: 'black', marginBottom: '10%' }} variant="h6">
        誰かのある日
      </Typography>

      <TextField
        style={{ width: '100%', marginBottom: '5%' }}
        multiline
        rows={20}
        value={diary.diary_content}
        disabled
      />
      <Grid container>
        <Button variant="contained" color="primary" onClick={() => fetchDiary()}>
          日記を取得
        </Button>
      </Grid>

      <Grid container justify="flex-end">
        <Button variant="contained" color="primary" onClick={() => upadteDiary()}>
          <FavoriteIcon color="error" />
          {diary.reaction}
        </Button>
      </Grid>
    </Container>
  );
};

export default DiaryFetch;
