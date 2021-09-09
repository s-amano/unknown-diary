import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
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

  useEffect(() => {
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
    fetchDiary();
  }, []);

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
    <Container className="sm:w-full md:w-700 mt-6">
      <div className="text-right mr-12 mb-1">
        <p className="text-gray-500 text-lg ml-auto">{diary.date ? diary.date : '日付なし'}</p>
      </div>

      <div className="bg-white text-center shadow-xl py-4 px-3 w-10/12 max-w-2xl rounded-md mx-6 mb-6">
        <p className="text-xl mb-3 text-black font-bold text-gray-600 text-left">
          {diary.title !== '' ? diary.title : 'タイトルなし'}
        </p>
        <p className="text-left mb-4 pl-3">{diary.content}</p>
        <div className="flex justify-end">
          <FavoriteIcon className="mr-1" color="error" onClick={() => upadteDiary()} />
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{diary.reaction}</p>
        </div>
      </div>

      <Grid container justify="flex-end">
        <Button style={{ marginRight: '3%' }} variant="contained" color="primary" onClick={() => fetchDiary()}>
          <p style={{ color: 'white', margin: '3px', fontWeight: 'bold' }}>日記を取得する</p>
        </Button>
      </Grid>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle id="simple-dialog-title">取得できる日記がありません。</DialogTitle>
      </Dialog>
    </Container>
  );
};

export default DiaryFetch;
