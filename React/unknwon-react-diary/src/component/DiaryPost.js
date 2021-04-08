import React, { useState } from 'react';
import { Auth, API } from 'aws-amplify';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

const DiaryPost = () => {
  const [diary, setDiary] = useState('');
  const [isSucces, setIsSucces] = useState(false);

  const updateDiary = () => (event) => {
    setDiary(event.target.value);
  };

  const getni = async function () {
    const apiName = 'GETStoreAPI';
    const path = '';

    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };

    API.get(apiName, path, myInit)
      .then((response) => {
        console.log(response);
        alert(response.diary_content);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  const survayPost = async function () {
    const apiName = 'POSTStoreAPI';
    const path = '';

    const postData = {
      content: diary,
    };
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
      body: postData,
      contentType: 'application/json',
    };

    API.post(apiName, path, myInit)
      .then(() => {
        console.log('成功');
        setIsSucces(true);
        setDiary('');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Container style={{ marginTop: '20px' }} maxWidth="md">
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
        value={diary}
        onChange={updateDiary()}
      />
      <Button variant="contained" color="primary" onClick={() => survayPost()}>
        送信する
      </Button>
      <Button variant="contained" color="primary" onClick={() => getni()}>
        日記取得
      </Button>
    </Container>
  );
};

export default DiaryPost;
