import React, { useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

const DiaryFetch = () => {
  const [diary, setDiary] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const envFetchAPI = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log(env);
    if (env === 'prod') {
      return 'GETStoreAPIProd';
    } else if (env === 'dev') {
      return 'GETStoreAPIDev';
    }
  };

  const envUpdateAPI = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log(env);
    if (env === 'prod') {
      return 'REACTIONDiaryAPIProd';
    } else if (env === 'dev') {
      return 'REACTIONDiaryAPIDev';
    }
  };

  const fetchDiary = async () => {
    const apiName = envFetchAPI();
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
        if (response.id === '') {
          handleClickOpen();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const upadteDiary = async () => {
    const apiName = envUpdateAPI();
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
      .then((response) => {
        console.log('成功');
        console.log(diary);
        setDiary({ ...diary, reaction: response.reaction });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container style={{ marginTop: '40px' }} maxWidth="md">
      {diary.id ? (
        <Grid container justifyContent="space-around" style={{ marginTop: '8%', marginBottom: '5%' }}>
          <Typography variant="h5" component="h2" style={{ marginBottom: '2%' }}>
            {diary.title !== '' ? diary.title : 'タイトル'}
          </Typography>
          <Typography variant="subtitle1" component="h2">
            {diary.date ? diary.date : '日付'}
          </Typography>
        </Grid>
      ) : (
        <Typography style={{ marginTop: '30px', color: 'black', marginBottom: '5%' }} variant="h6">
          誰かのある日
        </Typography>
      )}

      <TextField style={{ width: '100%', marginBottom: '5%' }} multiline rows={20} value={diary.content} disabled />
      <Grid container justify="flex-end">
        <Button style={{ marginRight: '3%' }} variant="contained" color="primary" onClick={() => fetchDiary()}>
          <p style={{ color: 'white', margin: '3px', fontWeight: 'bold' }}>日記を取得する</p>
        </Button>

        {diary.reaction ? (
          <Button variant="contained" color="primary" onClick={() => upadteDiary()}>
            <FavoriteIcon style={{ marginRight: '2%' }} color="error" />
            <p style={{ margin: 0, fontWeight: 'bold', color: 'white', fontSize: '16px' }}>{diary.reaction}</p>
          </Button>
        ) : (
          <></>
        )}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle id="simple-dialog-title">取得できる日記がありません。</DialogTitle>
      </Dialog>
    </Container>
  );
};

export default DiaryFetch;
