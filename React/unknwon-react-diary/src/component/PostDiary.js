import React, { useState, useMemo } from 'react';
import { Auth, API } from 'aws-amplify';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const DiaryPost = () => {
  const dateConvert = (date) => {
    var y = date.getFullYear();
    var m = ('00' + (date.getMonth() + 1)).slice(-2);
    var d = ('00' + date.getDate()).slice(-2);
    var result = y + '/' + m + '/' + d;
    return result;
  };

  const todayDate = new Date();
  const [postDiary, setPostDiary] = useState('');
  const [postDiaryTitle, setPostDiaryTitle] = useState('');
  const [inputDiaryDate, setInputDiaryDate] = useState(todayDate);
  const [postDiaryDate, setPostDiaryDate] = useState(dateConvert(todayDate));
  const [isSucces, setIsSucces] = useState(false);

  const isDateValid = useMemo(() => {
    if (!postDiaryDate.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
      return false;
    }
    var y = postDiaryDate.split('/')[0];
    var m = postDiaryDate.split('/')[1] - 1;
    var d = postDiaryDate.split('/')[2];
    var date = new Date(y, m, d);

    if (date.getFullYear() !== Number(y) || date.getMonth() !== m || date.getDate() !== Number(d)) {
      return false;
    }
    return true;
  }, [postDiaryDate]);

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
      title: postDiaryTitle,
      content: postDiary,
      date: postDiaryDate,
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
        console.log(postData);
        setPostDiary('');
        setPostDiaryTitle('');
        setPostDiaryDate(dateConvert(todayDate));
        setInputDiaryDate(todayDate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateDiary = () => (event) => {
    setPostDiary(event.target.value);
  };

  const updateDiaryTitle = () => (event) => {
    setPostDiaryTitle(event.target.value);
  };

  const updateDiaryDate = () => (date) => {
    const result = dateConvert(date);
    setPostDiaryDate(result);
    setInputDiaryDate(date);
  };

  return (
    <Container
      style={{ marginTop: '32px', marginBottom: '30px', paddingRight: '10%', paddingLeft: '10%' }}
      maxWidth="md"
    >
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
          style={{ margin: '16px' }}
        >
          日記を送信しました！
        </Alert>
      </Collapse>
      <TextField
        style={{ width: '100%' }}
        label="日記のタイトル"
        variant="filled"
        helperText="30字以下で入力してください"
        error={Boolean(postDiaryTitle.length !== 0 && !(postDiaryTitle.length <= 30))}
        value={postDiaryTitle}
        onChange={updateDiaryTitle()}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid
          container
          justifyContent="flex-start"
          style={{ justifyContent: 'flex-start', marginLeft: '1%', marginBottom: '16px' }}
        >
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            // label="日付"
            format="yyyy/MM/dd"
            value={inputDiaryDate}
            onChange={updateDiaryDate()}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            error={Boolean(!isDateValid)}
            helperText="有効な形式で日付を入力してください"
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <TextField
        style={{ width: '100%', marginBottom: '5%' }}
        label="日記の内容"
        multiline
        rows={15}
        value={postDiary}
        onChange={updateDiary()}
        // postする文字数が17文字未満(初期値は除く),5000文字以上の場合はエラー文表示
        error={Boolean(postDiary.length !== 0 && !(17 <= postDiary.length && postDiary.length < 5000))}
        helperText="17文字以上5000字以下で入力してください"
        variant="filled"
      />

      <Grid container justify="flex-start">
        <Button
          variant="contained"
          color="primary"
          onClick={() => survayPost()}
          disabled={Boolean(
            !(17 <= postDiary.length && postDiary.length < 5000 && postDiaryTitle.length <= 30 && isDateValid)
          )}
        >
          <p style={{ color: 'white', fontWeight: 'bold', margin: '3px' }}>日記を投稿する</p>
        </Button>
      </Grid>
    </Container>
  );
};

export default DiaryPost;
