import React, { useState } from 'react';
import { Auth, API } from 'aws-amplify';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CreateIcon from '@material-ui/icons/Create';

const DiaryPost = () => {
  const [postDiary, setPostDiary] = useState('');
  const [isSucces, setIsSucces] = useState(false);

  const envAPI = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log(env);
    if (env === 'prod') {
      return 'POSTStoreAPIProd';
    } else if (env === 'dev') {
      return 'POSTStoreAPIDev';
    }
  };

  const survayPost = async () => {
    const apiName = envAPI();
    const path = '';

    const postData = {
      content: postDiary,
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
        setIsSucces(true);
        setPostDiary('');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateDiary = () => (event) => {
    setPostDiary(event.target.value);
  };

  return (
    <Container style={{ marginTop: '40px' }} maxWidth="md">
      <Collapse in={isSucces}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setIsSucces(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          日記を送信しました！
        </Alert>
      </Collapse>
      <TextField
        style={{ width: '100%', marginBottom: '5%' }}
        label="日記を書く"
        multiline
        rows={20}
        value={postDiary}
        onChange={updateDiary()}
        // postする文字数が17文字未満(初期値は除く),5000文字以上の場合はエラー文表示
        error={Boolean(postDiary.length !== 0 && !(17 <= postDiary.length && postDiary.length < 5000))}
        helperText="17文字以上5000字以下で入力してください"
      />

      <Grid container justify="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => survayPost()}
          disabled={Boolean(!(17 <= postDiary.length && postDiary.length < 5000))}
        >
          <CreateIcon />
        </Button>
      </Grid>
    </Container>
  );
};

export default DiaryPost;
