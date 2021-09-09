import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import AddCommentIcon from '@material-ui/icons/AddComment';

const DiaryFetch = () => {
  const [diary, setDiary] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditComment, setIsEditComment] = useState(false);
  const [leaveComment, setLeaveComment] = useState('');

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleEditComment = () => {
    setIsEditComment(true);
  };

  const handleLeaveComment = () => {
    setIsEditComment(false);
  };

  const updateLeaveComment = () => (event) => {
    setLeaveComment(event.target.value);
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
        <p className="text-left mb-4 pl-3 whitespace-pre-wrap">{diary.content}</p>
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
      <div className="flex flex-col w-9/12 pl-8 mt-4">
        <p className="text-xl text-gray-800 font-semibold mb-3 text-left">コメント</p>
        <div className="bg-white shadow-xl rounded-2xl w-1/2 mb-2 text-left">
          <p className="ml-3">リプライ1</p>
        </div>
        <div className="bg-white shadow-xl rounded-2xl w-1/2 mb-2 text-left">
          <p className="ml-3">リプライ2</p>
        </div>
        <div className="flex-start w-1/2 mt-2">
          {isEditComment ? (
            <div className="flex">
              <TextField
                className="ml-1"
                value={leaveComment}
                onChange={updateLeaveComment()}
                helperText="10文字以下"
                error={Boolean(leaveComment.length >= 10)}
              />
              <Button onClick={() => handleLeaveComment()}>
                <AddCommentIcon />
              </Button>
            </div>
          ) : (
            <Button onClick={() => handleEditComment()}>
              <AddIcon />
            </Button>
          )}
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle id="simple-dialog-title">取得できる日記がありません。</DialogTitle>
      </Dialog>
    </Container>
  );
};

export default DiaryFetch;
