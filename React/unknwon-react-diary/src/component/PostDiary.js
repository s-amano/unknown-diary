import React, { useState, useMemo, useContext } from 'react';
import { Auth, API } from 'aws-amplify';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ApiContext } from '../context/ApiContext';
import DiaryForm from '../component/atoms/DiaryForm';

const DiaryPost = () => {
  const { loading, setLoading } = useContext(ApiContext);

  const dateConvert = (date) => {
    var y = date.getFullYear();
    var m = ('00' + (date.getMonth() + 1)).slice(-2);
    var d = ('00' + date.getDate()).slice(-2);
    var result = y + '/' + m + '/' + d;
    return result;
  };

  const todayDate = new Date();

  const [inputDiaryDate, setInputDiaryDate] = useState(todayDate);
  const [postDiaryDate, setPostDiaryDate] = useState(dateConvert(todayDate));
  const [inputDiary, setInputDiary] = useState({ title: '', content: '' });
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

  const survayPost = async () => {
    setLoading(true);
    const apiName = 'POSTStoreAPI';
    const path = '';

    const postData = {
      title: inputDiary.title,
      content: inputDiary.content,
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
        setIsSucces(true);
        setInputDiary({ title: '', content: '' });
        setPostDiaryDate(dateConvert(todayDate));
        setInputDiaryDate(todayDate);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const updateDiaryDate = () => (date) => {
    const result = dateConvert(date);
    setPostDiaryDate(result);
    setInputDiaryDate(date);
  };

  const handleInputChange = () => (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setInputDiary({ ...inputDiary, [name]: value });
  };

  return (
    <Container
      style={{ marginTop: '32px', marginBottom: '30px', paddingRight: '10%', paddingLeft: '10%' }}
      maxWidth="md"
    >
      {loading && <CircularProgress />}
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
      <DiaryForm
        inputDiary={inputDiary}
        handleInputChange={handleInputChange}
        updateDiaryDate={updateDiaryDate}
        isDateValid={isDateValid}
        survayPost={survayPost}
        inputDiaryDate={inputDiaryDate}
        postWord={'日記を投稿する'}
      />
    </Container>
  );
};

export default DiaryPost;
