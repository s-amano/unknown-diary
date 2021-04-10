import React, { useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const DiaryFetch = () => {
  const [diary, setDiary] = useState({});

  const fetchDiary = async () => {
    const env = process.env.NODE_ENV;
    let apiName = 'GETStoreAPIDev';
    console.log(env);
    if (env === 'production') {
      apiName = 'GETStoreAPIProd';
    }
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

  return (
    <Container style={{ marginTop: '20px' }} maxWidth="md">
      <Grid container justify="flex-end">
        <Button variant="contained" color="primary">
          <Link to="/post" style={{ textDecoration: 'none', color: 'white' }}>
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
      <Button variant="contained" color="primary" onClick={() => fetchDiary()}>
        日記を取得
      </Button>
    </Container>
  );
};

export default DiaryFetch;
